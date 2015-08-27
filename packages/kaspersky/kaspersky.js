Settings = {
  defaultCountry: {
    name: 'United States',
    key: '109'
  },
  defaultMetric: 'ids',
  dataDir: 'http://securelist.kaspersky-labs.com/securelist/',
  updateEvery: moment.duration({ hours: 48 }),
  numPnts: 24,
  metrics: [
    { code: 'ids', name: 'Inbound Network Attacks', sel: '.net-attacks', attrName: 'count' },
    { code: 'kas', name: 'Spam Sent', sel: '.spam', attrName: 'percent' },
    { code: 'oas', name: 'Detected Infections', sel: '.local-infections', attrName: 'count' },
    { code: 'vul', name: 'Vulnerabilities', sel: '.vulns', attrName: 'count' },
    { code: 'wav', name: 'Web Threats', sel: '.web-threats', attrName: 'count' }
    //{ code: 'ods', name: 'unknown',
    //{ code: 'mav', name: 'unknown',
  ]
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

KasperskyWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, { country: Settings.defaultCountry });
};
KasperskyWidget.prototype = Object.create(Widget.prototype);
KasperskyWidget.prototype.constructor = KasperskyWidget;

_.extend(KasperskyWidget.prototype, {
  setCountry: function(code) {
    var widget = this;
    var kaspCountries = CountryMetrics.find({}, {
      fields: { name: 1, key: 1 },
      sort: { name: 1 }
    }).fetch();

    CountryInfo.byCode(code, function(country) {
      var matches = country.name.fuzzy(_.pluck(kaspCountries, 'name'));
      var kaspMatch = _.findWhere(kaspCountries, { name: matches[0] });
      widget.data.set({ country: kaspMatch });
    });
  }
});

Kaspersky = {
  widget: {
    name: 'Threat Data',
    description: 'Shows hourly spam, attack, and infection data by country',
    url: 'https://cybermap.kaspersky.com/',
    dimensions: { width: 2, height: 3 },
    constructor: KasperskyWidget
  },
  org: {
    name: 'Kaspersky Lab ZAO',
    shortName: 'Kaspersky',
    url: 'http://www.kaspersky.com'
  }
};
