CountryTraffic.attachSchema(new SimpleSchema({
  regionId: {
    type: String
  },
  regionLabel: {
    type: String
  },
  updatedAt: {
    type: Date
  },
  fetchedAt: {
    type: Date
  },
  total: {
    type: Number
  },
  previousTotal: {
    type: Number,
    optional: true
  },
  percentAboveAverage: {
    type: Number,
    decimal: true
  },
  latLong: {
    type: Object,
    optional: true
  },
  'latLong.lat': {
    type: Number,
    decimal: true
  },
  'latLong.long': {
    type: Number,
    decimal: true
  }
}));

var xmlParser = Npm.require('xml2js');

var dataToDocs = function(xmlData) {
  var traffic = xmlData.xml.traffic[0];
  var updatedAt = new Date(traffic.timestamp[0]);
  var worldDoc = {
    regionId: '0',
    regionLabel: 'The World',
    fetchedAt: new Date(),
    updatedAt: updatedAt,
    total: parseInt(traffic.attr.current, 10),
    percentAboveAverage: parseFloat(traffic.attr.percent)
  };
  var docs = [worldDoc];
  var regions = xmlData.xml.traffic[0].regions[0].region;
  _.each(regions, function(region) {
    if (parseInt(region.attr.current, 10) === 0) {
      return;
    }
    var doc = {
      regionId: region.attr.id,
      regionLabel: region._,
      fetchedAt: new Date(),
      updatedAt: updatedAt,
      total: parseInt(region.attr.current, 10),
      previousTotal: parseInt(region.attr.previous, 10),
      percentAboveAverage: parseFloat(region.attr.percent),
      latLong: { lat: parseFloat(region.attr.lat), long: parseFloat(region.attr.long) }
    };
    docs.push(doc);
  });
  return docs;
};

var fetchData = function() {
  var xmlData = HTTP.get(Settings.feedUrl);
  var content = '<xml>' + xmlData.content + '</xml>'; 

  xmlParser.parseString(content, { attrkey: 'attr' }, function (error, result) {
      if (error) {
          console.error(error);
      } else {
        var docs = dataToDocs(result);
        if (docs.length > 0) {
          CountryTraffic.remove({});
        }
        _.each(docs, function(doc) {
          CountryTraffic.insert(doc);
        });
      }
  });
};

fetchData();
Meteor.setInterval(fetchData, Settings.downloadInterval);

Meteor.publish('country_traffic', function() {
  return CountryTraffic.find();
});
