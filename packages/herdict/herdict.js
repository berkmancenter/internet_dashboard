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

  _.extend(this, {
    width: 2,
    height: 2
  });

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

Herdict = {
  widget: {
    name: 'Website Availability',
    description: 'Shows the top URLs reported accessible or inaccessible by users on Herdict',
    url: 'http://herdict.org/explore/indepth',
    constructor: HerdictWidget,
  },
  org: {
    name: 'The Herdict Project',
    shortName: 'Herdict',
    url: 'http://herdict.org'
  }
};
