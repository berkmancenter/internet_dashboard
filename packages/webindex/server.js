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
  console.log('REINOS: 1');
  var jsonResponse, docs;
  jsonResponse = Future.wrap(HTTP.get)(Settings.feedUrl).wait();
  console.log('REINOS: 2');
  //console.log(jsonResponse);
  console.log('REINOS: 3');
  console.log('REINOS: 4');
  try {
    // They are returning their json as js so response.data doesn't work.
    // we have to explicitly parse response.content.
    docs = dataToDocs(jsonResponse.data.data);
    //docs = dataToDocs(JSON.parse(jsonResponse.content));
  } catch (e){
    console.log('Error converting data to docs',e);
  }
  console.log('REINOS: 5');
  if (docs.length > 0) {
    console.log('We got new data. Removing old...');
    WebIndexData.remove({});
  } else {
    console.log('No new data.');
  }
  console.log('REINOS: 6');
  _.each(docs, function(doc) {
    WebIndexData.insert(doc);
  });
  console.log('REINOS: 7');
  console.log('WebIndex: Fetched data');
};

if (Meteor.settings.doJobs) {
  Future.task(fetchData);
  Meteor.setInterval(fetchData.future(), Settings.downloadInterval);
}

Meteor.publish('webindex_data', function() {
  return WebIndexData.find();
});
