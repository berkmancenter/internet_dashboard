Settings = {
  defaultCountry: { iso2: 'US', iso3: 'USA', name: 'United States' },
  metric: '/metrics?id=53',
  attr: '/attributes?id=99'
};

GSMAPrepaidWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    country: Settings.defaultCountry,
  });
};

GSMAPrepaidWidget.prototype = Object.create(Widget.prototype);
GSMAPrepaidWidget.prototype.constructor = GSMAPrepaidWidget;

_.extend(GSMAPrepaidWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      var code = country.alpha3.toUpperCase();
      widget.data.set({ country: {
        iso2: countryCode.toUpperCase(),
        iso3: code,
        name: country.name
      }});
    });
  }
});

GSMAPrepaid = {
  widget: {
    name: 'Prepaid Connections',
    description: 'Shows the percentage of mobile connections in a country that are prepaid',
    url: 'https://gsmaintelligence.com/',
    dimensions: { width: 2, height: 1 },
    constructor: GSMAPrepaidWidget,
    typeIcon: 'line-chart',
    category: 'access'
  },
  org: {
    name: 'GSMA',
    shortName: 'GSMA',
    url: 'https://gsmaintelligence.com/'
  }
};
