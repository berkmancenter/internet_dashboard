CountryLists = new Mongo.Collection('herdict_country_lists');

CountryLists.attachSchema(new SimpleSchema({
  country: { type: Object },
  'country.code': { type: String },
  'country.name': { type: String },
  lists: { type: [Object] },
  'lists.$.category': { type: String },
  'lists.$.sites': { type: [Object] },
  'lists.$.sites.$.domain': { type: String },
  'lists.$.sites.$.title': { type: String, optional: true },
  'lists.$.sites.$.stats': { type: Object },
  'lists.$.sites.$.stats.accessible': { type: Number },
  'lists.$.sites.$.stats.inaccessible': { type: Number },
}));

Settings = {
  categories: [
    { name: 'Internet Tools', code: 'tools' },
    { name: 'Political', code: 'political' },
    { name: 'Social', code: 'social' },
    { name: 'Other', code: 'other' }
  ]
};

HerdictWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    country: {
      code: 'US',
      name: 'United States'
    },
    category: {
      code: 'tools',
      name: 'Internet Tools'
    }
  });
};

HerdictWidget.prototype = Object.create(Widget.prototype);
HerdictWidget.prototype.constructor = HerdictWidget;
_.extend(HerdictWidget.prototype, {
  setCountry: function(code) {
    this.data.set({ country: _.findWhere(CountryInfo.countries, { code: code }) });
  }
});

Herdict = {
  widget: {
    name: 'Crowdsourced Website Availability',
    description: 'Shows the top URLs reported available or unavailable by Herdict users',
    url: 'http://herdict.org/explore/indepth',
    dimensions: { width: 2, height: 2 },
    constructor: HerdictWidget,
  },
  org: {
    name: 'Herdict',
    shortName: 'Herdict',
    url: 'http://herdict.org'
  }
};
