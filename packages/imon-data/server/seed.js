var shouldCollect = function($node) {
  return _.contains(Settings.toCollect,
    $node.find(Settings.indicatorLinkSelector).text()
  );
};

var fetchIndicators = function(country) {
  var url = 'https://thenetmonitor.org/countries/' + country.code + '/access';
  HTMLScraper.inDoc(url, function($) {
    $('.indicators dt').each(function() {
      if (!shouldCollect($(this))) {
        return;
      }

      var name = $(this).find(Settings.indicatorLinkSelector).text();
      var value = $(this).next().find('.original-value').text();
      var percent = parseFloat(
        $(this).next().find('.indicator-bar-inner').data('value'));

      var indicator = {
        name: name,
        value: value,
        percent: percent
      };

      country.indicators.push(indicator);
      IMonCountries.update(country._id, { $set: { indicators: country.indicators }});
    });
  }, { proxy: Settings.proxy });
};

IMonCountries.seedCountries = function() {
  var url = 'https://thenetmonitor.org/countries/usa/access';
  HTMLScraper.inDoc(url, function($) {
    $('.countries-nav-list a').each(function() {
      var r = new RegExp('/countries/([a-z]{3})/');
      var country = {
        name: $(this).text(),
        code: r.exec($(this).attr('href'))[1],
        indicators: []
      };

      IMonCountries.insert(country, function(error, id) {
        fetchIndicators(IMonCountries.findOne(id));
      });
    });
  });
};

if (IMonCountries.find().count() === 0) {
  IMonCountries.seedCountries();
}

Meteor.publish('imon_countries', function() {
  return IMonCountries.find();
});
