Settings = {
  defaultCountry: {
    code: 'US',
    name: 'United States',
    key: '109'
  },
  defaultMetric: 'ids',
  dataDir: 'http://securelist.kaspersky-labs.com/securelist/',
  updateEvery: moment.duration({ hours: 24 }),
  metrics: {
    'ids': 'Network Attacks',
    'kas': 'Spam',
    //'mav': 'unknown',
    'oas': 'Local Infections',
    //'ods': 'unknown',
    'vul': 'Vulnerabilities',
    'wav': 'Web Threats'
  }
};
Settings.countriesUrl = Settings.dataDir + 'countries_all.xml';

CountryMetrics = new Mongo.Collection('kasp_country_metrics');
CountryMetrics.attachSchema(new SimpleSchema({
  name: { type: String },
  key: { type: String },
  metrics: { type: Object, optional: true },
  'metrics.ids': { type: [Object], optional: true },
  'metrics.ids.$.date': { type: Date },
  'metrics.ids.$.count': { type: Number },
  'metrics.ids.$.updatedAt': { type: Date },

  'metrics.kas': { type: [Object], optional: true },
  'metrics.kas.$.date': { type: Date },
  'metrics.kas.$.count': { type: Number },
  'metrics.kas.$.updatedAt': { type: Date },

  'metrics.oas': { type: [Object], optional: true },
  'metrics.oas.$.date': { type: Date },
  'metrics.oas.$.count': { type: Number },
  'metrics.oas.$.updatedAt': { type: Date },

  'metrics.vul': { type: [Object], optional: true },
  'metrics.vul.$.date': { type: Date },
  'metrics.vul.$.count': { type: Number },
  'metrics.vul.$.updatedAt': { type: Date },

  'metrics.wav': { type: [Object], optional: true },
  'metrics.wav.$.date': { type: Date },
  'metrics.wav.$.count': { type: Number },
  'metrics.wav.$.updatedAt': { type: Date },
}));
