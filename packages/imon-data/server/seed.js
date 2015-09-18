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
  return HTMLScraper.inDoc(url, function($) {
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

    try {
      IMonCountryData.update(country._id, { $set: {
        imageUrl: countryUrl(country) + '/thumb',
        access: access,
        indicators: country.indicators,
      }});
    } catch (error) {
      console.error('IMonData: Error updating data');
      console.error(error);
      throw new Error(error);
    }
  }, { proxy: Settings.proxy });
};

IMonCountryData.fetch = function() {
  var url = Settings.baseUrl + '/countries/usa/access';
  console.log('IMonData: Fetching data');
  HTMLScraper.inDoc(url, function($) {
    var futures = [];
    var future;
    $('.countries-nav-list a').each(function() {
      var r = new RegExp('/countries/([a-z]{3})/');
      var country = {
        name: $(this).text(),
        code: r.exec($(this).attr('href'))[1],
        indicators: []
      };

      var id = IMonCountryData.insert(country);
      futures.push(fetchCountryData(IMonCountryData.findOne(id)));
    });
    Future.wait(futures);
    console.log('IMonData: Fetched data');
  });
};

if (IMonCountryData.find().count() === 0) {
  Future.task(IMonCountryData.fetch);
}

Meteor.publish('imon_countries', function() {
  var publication = this;
  var pipeline = [
    { $group: {
        _id: '$code',
        code: { $first: '$code' },
        name: { $first: '$name' },
        rank: { $first: '$access.rank' }
      }
    },
    { $sort: { _id: 1 }}
  ];
  var countries = IMonCountryData.aggregate(pipeline);
  _.each(countries, function(country) {
    publication.added('imon_countries', country.code, country);
  });
  publication.ready();
});
Meteor.publish('imon_data', function(code) {
  return IMonCountryData.find({ code: code });
});
