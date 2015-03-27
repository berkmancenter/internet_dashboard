Settings = {
  toCollect: [
    'Percentage of individuals using the Internet',
    'Average connection speed (kbps)',
    'Average download speed (kbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (0-1 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>1-4 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>4-10 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>10-25 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>25 Mbps)',
  ],
  indicatorLinkSelector: 'a[href="/sources"]',
  proxy: false
};

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
    type: String,
    decimal: true
  },
  'indicators.$.percent': {
    type: Number,
    decimal: true
  }
}));
