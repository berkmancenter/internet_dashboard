Settings.timeout = 60 * 1000;
var Future = Npm.require('fibers/future');

var ucWords = function(str) {
  // From http://phpjs.org/functions/ucwords/
  return (str + '')
    .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
      return $1.toUpperCase();
    });
};

var countryUrl = function(country, metric) {
  return Settings.dataDir + 'graphic_' + metric.code + '_d_' + country.key + '.xml';
};

var metricsCurrent = function() {
  var country = CountryMetrics.findOne({ key: Settings.defaultCountry.key });
  return _.every(Settings.metrics, function(metric) {
    if (!country.metrics || !country.metrics[metric.code]) {
      return false;
    }

    return moment(country.metrics[metric.code][0].updatedAt)
        .isAfter(moment.utc().subtract(Settings.updateEvery));
  });
};

var countriesExist = function() {
  return CountryMetrics.find().count() > 0;
};

var addCountryData = function(country, data) {
  CountryMetrics.update({ key: country.key }, { $set: data });
};

var parseCountryData = function(response, country, metric) {
  var xmlParser = Npm.require('xml2js');
  var metricKey = 'metrics.' + metric.code;
  var data = {};
  data[metricKey] = [];

  var future = Future.wrap(xmlParser.parseString)(response.content,
                                                  { attrkey: 'attr' });
  var result;
  try {
    result = future.wait();
  } catch (error) {
    console.error('Kaspersky: Parsing error');
    console.error(error);
    throw new Error(error);
  }

  _.each(result.root.graphic[0].item, function(item) {
    data[metricKey].push({
      date: Date.parse(item.attr.date + ' +0000'),
      count: parseInt(item.attr[metric.attrName], 10),
      updatedAt: Date.parse(result.root.date[0] + ' +0000')
    });
  });

  addCountryData(country, data);
};

var fetchCountryData = function(country, metric) {
  var options = {
    timeout: Settings.timeout,
    headers: {
      'User-Agent': 'InternetMonitorDashboard/1.0 KasperskyWidget/0.1'
    }
  };

  var response;
  var future = Future.wrap(HTTP.get)(countryUrl(country, metric), options);

  try {
    response = future.wait();
  } catch(error) {
    if (!error.response || error.response.statusCode !== 404) {
      console.error('Kaspersky: Error fetching ' + countryUrl(country, metric));
      console.error(error);
      throw new Error(error);
    }
    //console.log('Kaspersky: ' + metric.name + ' data not available for ' + country.name);
    return false;
  }

  parseCountryData(response, country, metric);
};

var fetchAllCountryData = function() {
  console.log('Kaspersky: Fetching data for all countries');
  CountryMetrics.find().forEach(function(country,i) {
    _.each(Settings.metrics, function(metric) {
      // Each of these could be in a separate fiber, but they then eat all the
      // CPU when parsing.
      fetchCountryData(country, metric);
    });
  });
  console.log('Kaspersky: Fetched data for all countries');
};

var fetchCountries = function() {
  console.log('Kaspersky: Fetching countries');
  var xmlParser = Npm.require('xml2js');

  var future = Future.wrap(HTTP.get)(Settings.countriesUrl,
                                  { timeout: Settings.timeout });
  var xmlData;
  try {
    xmlData = future.wait();
  } catch (error) {
    console.error('Kaspersky: Fetch error');
    console.error(error);
    throw new Error(error);
  }

  var parseFuture = Future.wrap(xmlParser.parseString)(xmlData.content,
                                                       { attrkey: 'attr' });
  var result;
  try {
    result = parseFuture.wait();
  } catch (error) {
    console.error('Kaspersky: Parsing error');
    console.error(error);
    throw new Error(error);
  }

  var countries = result.root.countries[0].item;
  _.each(countries, function(country) {
    country.attr.name = ucWords(country.attr.name);
    CountryMetrics.insert(country.attr);
  });
};

Future.task(function() {
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
});

Kaspersky.widget.jobs = {
  kaspersky_fetch: fetchAllCountryData.future()
};
var job = new WidgetJob('kaspersky_fetch');
job.repeat({ wait: Settings.updateEvery.asMilliseconds() });
job.save();

Meteor.publish('kasp_metrics', function() {
  return CountryMetrics.find();
});
