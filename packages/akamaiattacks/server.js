var Future = Npm.require('fibers/future');

CountryAttacks.attachSchema(new SimpleSchema({
  regionId: {
    type: String
  },
  regionLabel: {
    type: String
  },
  countryCode: {
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
  },
  rules: {
    type: [Object],
    optional: true
  },
  'rules.$.triggers': {
    type: Number
  },
  'rules.$.name': {
    type: String
  }
}));

var xmlParser = Npm.require('xml2js');

var dataToDocs = function(xmlData) {
  var attacks = xmlData.xml.attack[0];
  var updatedAt = new Date(attacks.timestamp[0]);
  var worldDoc = {
    regionId: '0',
    regionLabel: 'The World',
    countryCode: 'ZZZ',
    fetchedAt: new Date(),
    updatedAt: updatedAt,
    total: parseInt(attacks.total_triggers[0], 10),
    percentAboveAverage: parseFloat(attacks.attr.percent)
  };
  var docs = [worldDoc];
  var regions = attacks.regions[0].region;
  _.each(regions, function(region) {
    if (parseInt(region.attr.current, 10) === 0) {
      return;
    }
    var country = Future.wrap(CountryInfo.byName)(region.name[0]).wait();
    if (!country || !country.alpha3) { return; }
    var doc = {
      regionId: region.attr.id,
      regionLabel: region.name[0],
      countryCode: country.alpha3,
      fetchedAt: new Date(),
      updatedAt: updatedAt,
      total: parseInt(region.attr.current, 10),
      previousTotal: parseInt(region.attr.previous, 10),
      percentAboveAverage: parseFloat(region.attr.percent),
      latLong: { lat: parseFloat(region.attr.lat), long: parseFloat(region.attr.long) },
      rules: _.map(region.rule, function(rule) { return { name: rule._, triggers: rule.attr.triggers }; })
    };
    docs.push(doc);
  });
  return docs;
};

var fetchData = function() {
  console.log('AkamaiAttacks: Fetching data');
  var xmlData = Future.wrap(HTTP.get)(Settings.feedUrl).wait();
  var content = '<xml>' + xmlData.content + '</xml>';

  var future = Future.wrap(xmlParser.parseString)(content, { attrkey: 'attr' });
  var result;
  try {
    result = future.wait();
  } catch (error) {
    console.error(error);
  }

  var docs = dataToDocs(result);
  if (docs.length > 0) {
    CountryAttacks.remove({});
  }
  _.each(docs, function(doc) {
    try {
      CountryAttacks.insert(doc);
    } catch (e) {
      console.error(e);
    }
  });

  console.log('AkamaiAttacks: Fetched data');
};

if (Meteor.settings.doJobs) {
  Future.task(fetchData);
  Meteor.setInterval(fetchData.future(), Settings.downloadInterval);
}

Meteor.publish('country_attacks', function() {
  return CountryAttacks.find();
});
