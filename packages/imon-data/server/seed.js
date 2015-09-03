var Future = Npm.require('fibers/future');

var countryUrl = function(country) {
  return Settings.baseUrl + '/countries/' + country.code;
};
var shouldCollect = function($node) {
  return _.contains(Settings.toCollect,
    $node.find(Settings.indicatorLinkSelector).text()
  );
};

var fetchCountryData = function(country) {
  var url = countryUrl(country) + '/access';
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
    });

    var access = {
      score: parseFloat($('.imon-score').text()),
      rank: parseInt($('.imon-rank').text().replace(/\D/, '')),
      url: url
    };

    IMonCountries.update(country._id, { $set: {
      imageUrl: countryUrl(country) + '/thumb',
      access: access,
      indicators: country.indicators,
    }});


  }, { proxy: Settings.proxy });
};

IMonCountries.seedCountries = function() {
  var url = Settings.baseUrl + '/countries/usa/access';
  console.log('IMonData: Fetching data');
  HTMLScraper.inDoc(url, function($) {
    $('.countries-nav-list a').each(function() {
      var r = new RegExp('/countries/([a-z]{3})/');
      var country = {
        name: $(this).text(),
        code: r.exec($(this).attr('href'))[1],
        indicators: []
      };

      IMonCountries.insert(country, function(error, id) {
        fetchCountryData(IMonCountries.findOne(id));
      });
    });
    console.log('IMonData: Fetched data');
  });
};

if (IMonCountries.find().count() === 0) {
  Future.task(IMonCountries.seedCountries);
}

Meteor.publish('imon_countries', function() {
  return IMonCountries.find();
});
