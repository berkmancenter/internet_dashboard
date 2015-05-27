var countryUrl = function(country, metric) {
  return Settings.dataDir + 'graphic_' + metric.code + '_d_' + country.key + '.xml';
};

var metricsCurrent = function() {
  var country = CountryMetrics.findOne({ key: Settings.defaultCountry.key });
  return _.every(Settings.metrics, function(metric) {
    if (!country.metrics[metric.code]) {
      return false;
    }

    return moment(country.metrics[metric.code][0].updatedAt)
        .isAfter(moment.utc().subtract(24, 'hours'));
  });
};

var countriesExist = function() {
  return CountryMetrics.find().count() > 0;
};

var fetchCountryData = function(country, metric) {
  var xmlParser = Npm.require('xml2js');
  var xmlData;

  try { 
    xmlData = HTTP.get(countryUrl(country, metric));
  } catch (error) {
    if (!error.response || error.response.statusCode !== 404) {
      throw new Error(error);
    }
    //console.log('Kaspersky: ' + metric.name + ' data not available for ' + country.name);
    return false;
  }

  var metricKey = 'metrics.' + metric.code;
  var data = {};
  data[metricKey] = [];

  xmlParser.parseString(xmlData.content, { attrkey: 'attr' }, function (error, result) {
    if (error) {
      throw new Error(error);
    }

    _.each(result.root.graphic[0].item, function(item) {
      data[metricKey].push({
        date: Date.parse(item.attr.date + ' +0000'),
        count: parseInt(item.attr[metric.attrName], 10),
        updatedAt: Date.parse(result.root.date[0] + ' +0000')
      });
    });

    CountryMetrics.update({ key: country.key }, { $set: data });
  });
};

var fetchAllCountryData = function() {
  CountryMetrics.find().forEach(function(country) {
    console.log('Kaspersky: Fetching data for ' + country.name);
    _.each(Settings.metrics, function(metric) {
      fetchCountryData(country, metric);
    });
  });
};

var fetchCountries = function() {
  var xmlParser = Npm.require('xml2js');

  var xmlData = HTTP.get(Settings.countriesUrl);
  xmlParser.parseString(xmlData.content, { attrkey: 'attr' }, function (error, result) {
    if (error) {
      throw new Error(error);
    }

    var countries = result.root.countries[0].item;
    _.each(countries, function(country) {
      CountryMetrics.insert(country.attr);
    });
  });
};

if (!countriesExist()) {
  fetchCountries();
} else {
  console.log('Kaspersky: Not fetching countries');
}

if (countriesExist() && !metricsCurrent()) {
  fetchAllCountryData();
} else {
  console.log('Kaspersky: Not fetching country metrics');
}

Meteor.setInterval(fetchAllCountryData, Settings.updateEvery.asMilliseconds());

Meteor.publish('kasp_metrics', function(countryKey) {
  return CountryMetrics.find({ key: countryKey });
});
