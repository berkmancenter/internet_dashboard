VisitorFeed._createCappedCollection(6 * Math.pow(2, 20), 10);
VisitorFeed.attachSchema(new SimpleSchema({
  regionId: {
    type: String
  },
  regionLabel: {
    type: String
  },
  fetchedAt: {
    type: Date
  },
  total: {
    type: Number
  },
  peakTotal: {
    type: Number
  },
  lastHour: {
    type: [Object]
  },
  'lastHour.$.timestamp': {
    type: Date
  },
  'lastHour.$.value': {
    type: Number
  },
  lastDay: {
    type: [Object]
  },
  'lastDay.$.timestamp': {
    type: Date
  },
  'lastDay.$.value': {
    type: Number
  },
  lastSixMonths: {
    type: [Object],
    optional: true
  },
  'lastSixMonths.$.timestamp': {
    type: Date
  },
  'lastSixMonths.$.value': {
    type: Number
  },
  ts: {
    type: MongoInternals.MongoTimestamp
  }
}));

var xmlParser = Npm.require('xml2js');

var mungeHistory = function(history) {
  var docs = [];
  _.each(history.month, function(month) {
      var yearNum = parseInt(month.attr.year, 10);
      var monthNum = parseInt(month.attr.id, 10) - 1;
    _.each(month.day, function(day) {
      var dayNum = parseInt(day.attr.number, 10);
      docs.push({
        timestamp: moment.utc().year(yearNum).month(monthNum).date(dayNum).toDate(),
        value: parseInt(day.value[0], 10)
      });
    });
  });
  return docs;
};

var objectToTimestamp = function(object) {
  var keysToMethods = {
    'hour': 'hour',
    'minute': 'minute',
    'month': 'month',
    'day': 'date',
    'year': 'year'
  };
  var fixIndex = ['month'];
  var timestamp = moment.utc();
  _.each(object, function(value, key) {
    value = parseInt(value, 10);
    if (_.contains(fixIndex, key)) {
      value -= 1;
    }
    timestamp[keysToMethods[key]].call(timestamp, value);
  });
  return timestamp.toDate();
};

var mungeFeedItem = function(object) {
  return {
    timestamp: objectToTimestamp(object.attr),
    value: parseInt(object._, 10)
  };
};

var dataToDocs = function(xmlData) {
  var docs = [];
  var worldDoc = {};
  _.each(xmlData.xml.data[0].region, function(region) {
    var doc = {
      regionId: region.attr.id,
      regionLabel: region.attr.label,
      fetchedAt: new Date(),
      total: parseInt(region.current_total, 10),
      peakTotal: parseInt(region.peak_total, 10),
      lastHour: _.map(region.onehour[0].hour, mungeFeedItem),
      lastDay: _.map(region.oneday[0].hour, mungeFeedItem)
    };
    if (region.attr.id === '0') {
      worldDoc = doc;
    } else {
      docs.push(doc);
    }
  });
  worldDoc.lastSixMonths = mungeHistory(xmlData.xml.history[0]);
  docs.push(worldDoc);
  return docs;
};

var fetchData = function() {
  var xmlData = HTTP.get(Settings.feedUrl);
  var content = '<xml>' + xmlData.content + '</xml>'; 
  content = content.replace(/1hour>/g, 'onehour>');
  content = content.replace(/24hour>/g, 'oneday>');

  xmlParser.parseString(content, { attrkey: 'attr' }, function (error, result) {
      if (error) {
          console.error(error);
      } else {
        _.each(dataToDocs(result), function(doc) {
          doc.ts = new MongoInternals.MongoTimestamp(0, 0);
          VisitorFeed.insert(doc);
        });
      }
  });
};

fetchData();
Meteor.setInterval(fetchData, Settings.downloadInterval);

Meteor.publish('visitor_feed', function(regionId) {
  return VisitorFeed.find({ regionId: regionId });
});
