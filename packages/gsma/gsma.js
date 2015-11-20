GSMAData = new Mongo.Collection('gsma_data');
GSMAData.attachSchema(new SimpleSchema({
  start: { type: Date },
  value: { type: Number, decimal: true },
  metric: { type: String },
  geo: { type: Object },
  'geo.type': { type: String },
  'geo.code': { type: String }
}));

Settings = {
  updateEvery: moment.duration({ months: 6 }),
  defaultCountry: 'USA'
};

GSMAWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, { country: Settings.defaultCountry });
};

GSMAWidget.prototype = Object.create(Widget.prototype);
GSMAWidget.prototype.constructor = GSMAWidget;

_.extend(GSMAWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      var code = country.alpha3.toUpperCase();
      widget.data.set({ country: code });
    });
  }
});

GSMA = {
  widget: {
    name: 'Takedown Requests',
    description: 'Shows the number of requests for removal of online materials Chilling Effects has received over time',
    url: 'https://www.chillingeffects.org/',
    dimensions: { width: 2, height: 1 },
    constructor: GSMAWidget,
    typeIcon: 'bar-chart',
    category: 'control'
  },
  org: {
    name: 'Chilling Effects',
    shortName: 'Chilling Effects',
    url: 'https://www.chillingeffects.org/',
  }
};
