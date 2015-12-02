Settings = {
  defaultCountry: { iso2: 'US', iso3: 'USA', name: 'United States' },
  metric: '/metrics?id=3',
  attr: '/attributes?id=0'
};

GSMATotalWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    country: Settings.defaultCountry,
  });
};

GSMATotalWidget.prototype = Object.create(Widget.prototype);
GSMATotalWidget.prototype.constructor = GSMATotalWidget;

_.extend(GSMATotalWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      if (_.isUndefined(country)) { return; }
      var code = country.alpha3.toUpperCase();
      widget.data.set({ country: {
        iso2: countryCode.toUpperCase(),
        iso3: code,
        name: country.name
      }});
    });
  }
});

GSMATotal = {
  widget: {
    name: 'Mobile Connections',
    description: 'Shows the number of mobile connections per 100 people in a country',
    url: 'https://gsmaintelligence.com/',
    dimensions: { width: 2, height: 1 },
    constructor: GSMATotalWidget,
    typeIcon: 'line-chart',
    category: 'access'
  },
  org: {
    name: 'GSMA Intelligence',
    shortName: 'GSMA Intelligence',
    url: 'https://gsmaintelligence.com/'
  }
};
