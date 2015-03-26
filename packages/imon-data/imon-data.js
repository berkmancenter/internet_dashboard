IMonCountry = function(doc) {
  _.extend(this, doc);
};

IMonCountries = new Mongo.Collection('imon_countries', {
  transform: function(doc) { return new IMonCountry(doc); }
});

IMonCountries.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  indicators: {
    type: [Object]
  },
  'indicators.$.name': {
    type: String
  },
  'indicators.$.value': {
    type: Number,
    decimal: true
  }
}));
