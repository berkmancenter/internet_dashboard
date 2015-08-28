var url = function(args) {
  var urlTemplate = 'http://herdict.org/explore/module/topsitescategory?40=&fc=<%= countryCode %>';
  return _.template(urlTemplate)(args);
};

var updateData = function() {
  _.each(CountryInfo.countries, function(country) {

    console.log('Herdict: Fetching ' + country.name);

    var thisUrl = url({ countryCode: country.code });
    var lists = [];

    HTMLScraper.inDoc(thisUrl, function($) {
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
  });
};

if (CountryLists.find().count() === 0) {
  updateData();
}

Settings.updateEvery = moment.duration({ days: 1 }).asMilliseconds();
Meteor.setInterval(updateData, Settings.updateEvery);

Meteor.publish('herdict_country_lists', function(countryCode) {
  return CountryLists.find({ 'country.code': countryCode });
});
