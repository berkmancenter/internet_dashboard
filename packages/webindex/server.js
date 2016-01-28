var Future = Npm.require('fibers/future');

WebIndexData.attachSchema(new SimpleSchema({
  countryCode: {
    type: String
  },
  year : {
    type: String
  },
  fetchedAt: {
    type: Date
  },
  score: {
    type: Number,
    decimal: true
  },
  latLong: {
    type: Object,
    optional: true
  },
  metricId: {
    type: String
  },
  metricName: {
    type: String
  }
}));

var dataToDocs = function(jsonData) {
  var docs = [];
  _.each(jsonData, function(datum) {
    var doc = {
      countryCode: datum.code,
      fetchedAt: new Date(),
      year: datum.year,
      score: datum.ranked,
      metricId: datum.indicator,
      metricName: datum.indicator_name
    };
    if (doc.year === '2013' ){
      docs.push(doc);
    }
  });
  return docs;
};

var fetchData = function() {
  console.log('WebIndex: Fetching data');
  var jsonResponse, docs;
  jsonResponse = Future.wrap(HTTP.get)(Settings.feedUrl).wait();
  try {
    // They are returning their json as js so response.data doesn't work.
    // we have to explicitly parse response.content.
    //docs = dataToDocs(jsonResponse.data.data);
    docs = dataToDocs(JSON.parse(jsonResponse.content).data);
  } catch (e){
    console.error('WebIndex: Error converting data to docs');
    console.error(e);
  }
  if (docs.length > 0) {
    console.log('WebIndex: We got new data. Removing old...');
    WebIndexData.remove({});
  } else {
    console.log('WebIndex: No new data.');
  }
  _.each(docs, function(doc) {
    WebIndexData.insert(doc);
  });
  console.log('WebIndex: Fetched data');
  WebIndexData._ensureIndex({metricId:1});
  console.log('WebIndex: Indexed data');
};

if (Meteor.settings.doJobs) {
  Future.task(fetchData);
  Meteor.setInterval(fetchData.future(), Settings.downloadInterval);
}

Meteor.publish('webindex_data', function() {
  var selector = {metricId:{ $in: _.pluck(WebIndex.metrics,'id')}};
  var options  = {fields: {score: 1, countryCode: 1, metricId: 1} };
  var docs = WebIndexData.find(selector,options);
  return docs;
});
