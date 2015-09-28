var Future = Npm.require('fibers/future');

var url = function(args) {
  var urlTemplate = 'http://herdict.org/explore/module/topsitescategory?40=&fc=<%= countryCode %>';
  return _.template(urlTemplate)(args);
};

var updateData = function() {
  console.log('Herdict: Fetching new data');
  var futures = [];
  _.each(CountryInfo.countries, function(country) {

    var thisUrl = url({ countryCode: country.code });
    var lists = [];

    var future = HTMLScraper.inDoc(thisUrl, function($) {
      $('h4').each(function() {
        var category = $(this).text();
        var sites = [];
        $(this).next('.topitems-list').children('li').each(function() {
          var $anchor = $(this).find('a.explore-navigation-link');
          var site = {
            domain: $anchor.text(),
            title: $anchor.attr('title'),
            stats: {
              accessible: parseInt($(this).find('.accessible').text(), 10),
              inaccessible: parseInt($(this).find('.inaccessible').text(), 10)
            }
          };
          sites.push(site);
        });

        lists.push({ category: category, sites: sites });
      });

      CountryLists.upsert({ country: country }, { $set: { lists: lists } });
    });
    futures.push(future);
    future.wait(); // Make fetching synchronous so we don't completely eat the CPU
  });
  Future.wait(futures);
  console.log('Herdict: Fetched new data');
};

if (CountryLists.find().count() === 0) {
  Future.task(updateData);
}

Settings.updateEvery = moment.duration({ days: 1 }).asMilliseconds();
Herdict.widget.jobs = {
  herdict_fetcher: function(data) { Future.task(updateData); }
};
var job = new WidgetJob('herdict_fetcher');
job.repeat({ wait: Settings.updateEvery }).save();

Meteor.publish('herdict_country_lists', function(countryCode) {
  return CountryLists.find({ 'country.code': countryCode });
});
