GSMAData.attachSchema(new SimpleSchema({
  start: { type: Date },
  value: { type: Number, decimal: true },
  metric: { type: String },
  attribute: { type: String },
  geo: { type: Object },
  'geo.type': { type: String },
  'geo.code': { type: String }
}));

Settings = {
  updateEvery: moment.duration({ months: 6 }),
  authToken: Assets.getText('apiKey.txt'),
  timeout: 60 * 1000,
  limit: 20,
  perPeople: 100.0,
  oldestData: moment.duration({ years: 3 })
};

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

function insertDatum(value, metric, attr, geo) {
  var start = new Date(value.date);

  // Throw away anything that isn't quarterly, or is a forecast, or is older
  // than three years.
  if (value.dateType !== 'Q' ||
      value.confidence === 'forecast' ||
      start < moment().subtract(Settings.oldestData).toDate()) { return; }

  var datum = {
    start: start,
    value: value.value,
    metric: metric,
    attribute: attr,
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
  var result, metric, attr, geo, url, totalSets, skip;

  _.each(attrUrls, function(attrUrl) {
    totalSets = 1;
    skip = 0;

    while(skip < totalSets) {
      try {
        url = attrUrl + '&_limit=' + Settings.limit + '&_skip=' + skip;
        result = get(url, {
          headers: { 'X-APP-KEY': Settings.authToken },
          timeout: Settings.timeout
        }).wait();
      } catch(error) {
        console.error('GSMA: Fetch error');
        console.error(error);
        throw new Error(error);
      }

      _.each(result.data.items, function(item) {
        metric = _.findWhere(item._links, { rel: 'metric' }).href;
        attr = _.findWhere(item._links, { rel: 'attribute' }).href;
        geo = mungeGeo(_.findWhere(item._links, { rel: 'refers-to' }));

        _.each(item.values, function(value) {
          insertDatum(value, metric, attr, geo);
        });
      });

      totalSets = result.data.totalSets;
      skip += Settings.limit;
    }
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

Meteor.publish('gsma_data', function(geoCode, metric, attr) {
  var publication = this;
  var values = GSMAData.find(
      { 'geo.code': geoCode, metric: metric, attribute: attr },
      { sort: { start: 1 }});

  var baseline, count = values.count();

  values.forEach(function(datum, i) {
    if (i === 0) {
      baseline = datum.value === 0 ? 0.00001 : datum.value;
    }

    var percentChange = datum.value / baseline - 1.0;
    var id = geoCode + metric + attr + datum.start.toString();
    var doc = {
      start: datum.start,
      value: percentChange,
      geoCode: geoCode,
      metric: metric,
      attr: attr
    };
    if (i === count - 1) {
      // Normalize connections by population
      if (metric === '/metrics?id=3' && attr === '/attributes?id=0') {
        var pop = Meteor.call('populationByCode', geoCode);
        if (pop) {
          doc.current = Math.round(datum.value / (pop / Settings.perPeople) * 10) / 10.0;
        }
      } else {
        doc.current = datum.value;
      }
    }
    publication.added('gsma_data', id, doc);
  });
  publication.ready();
});
