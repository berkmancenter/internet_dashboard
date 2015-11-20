Settings.authToken = Assets.getText('apiKey.txt');
Settings.timeout = 60 * 1000;
Settings.limit = 300;

var Future = Npm.require('fibers/future');
var get = Future.wrap(HTTP.get);
var attrUrls = [
  'https://api.gsmaintelligence.com/zones/data?metric.id=3&attribute.id=0',
  'https://api.gsmaintelligence.com/zones/data?metric.id=53&attribute.id=99',
  'https://api.gsmaintelligence.com/zones/data?metric.id=53&attribute.id=755',
  'https://api.gsmaintelligence.com/zones/data?metric.id=53&attribute.id=799'
];

function mungeGeo(geo) {
  var newGeo = {
    type: geo.type.replace('zone/', ''),
    code: ''
  };
  if (newGeo.type === 'country') {
    newGeo.code = geo.href.replace('/zones?isoCode=', '');
  } else {
    newGeo.code = geo.href;
  }

  return newGeo;
}

function insertDatum(value, metric, geo) {
  if (value.dateType !== 'Q' ||
      value.confidence === 'forecast') { return; }

  var datum = {
    start: new Date(value.date),
    value: value.value,
    metric: metric,
    geo: geo
  };

  try {
    GSMAData.insert(datum);
  } catch (e) {
    console.error(e);
  }
}

function updateGSMAData() {
  console.log('GSMA: Fetching new data');
  GSMAData.remove({});
  var result;

  _.each(attrUrls, function(url) {
    try {
      result = get(url + '&_limit=' + Settings.limit, {
        headers: { 'X-APP-KEY': Settings.authToken },
        timeout: Settings.timeout
      }).wait();
    } catch(error) {
      console.error('GSMA: Fetch error');
      console.error(error);
      throw new Error(error);
    }

    _.each(result.data.items, function(item) {
      var metric = _.findWhere(item._links, { rel: 'metric' }).href;
      var geo = mungeGeo(_.findWhere(item._links, { rel: 'refers-to' }));

      _.each(item.values, function(value) { insertDatum(value, metric, geo); });

    });
  });
  console.log('GSMA: Fetched new data');
}

if (Meteor.settings.doJobs) {
  if (GSMAData.find().count() === 0 ||
      GSMAData.findOne({}, { sort: { start: -1 } }).start +
      Settings.updateEvery.asMilliseconds() < Date.now()) {
    Future.task(updateGSMAData);
  } else {
    console.log('GSMA: Not updating data');
  }
}

Meteor.publish('gsma_data', function(geoCode) {
  return GSMAData.find({ geo: geoCode });
});
