Settings = {
  baseUrl: 'https://thenetmonitor.org',
  proxy: true,
  indicatorLinkSelector: 'a[href="/sources"]',
  updateEvery: 1000 * 60 * 60 * 24 * 7,
  toCollect: [
    'Percentage of individuals using the Internet',
    'Broadband adoption rate',
    'Average connection speed (kbps)',
    'Average download speed (kbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (0-1 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>1-4 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>4-10 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>10-25 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>25 Mbps)',
  ],
};

IMonCountryData = new Mongo.Collection('imon_data');
IMonCountryData.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  imageUrl: {
    type: String,
    optional: true
  },
  access: {
    type: Object,
    optional: true
  },
  'access.score': {
    type: Number,
    decimal: true
  },
  'access.rank': {
    type: Number
  },
  'access.url': {
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
