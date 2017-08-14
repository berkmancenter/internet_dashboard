Settings = {
  defaultCountry: { iso2: 'US', iso3: 'USA', name: 'United States' },
  metric: '/metrics?id=53',
  attr: '/attributes?id=755'
};

GSMA3GWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    country: Settings.defaultCountry,
  });
};

GSMA3GWidget.prototype = Object.create(Widget.prototype);
GSMA3GWidget.prototype.constructor = GSMA3GWidget;

_.extend(GSMA3GWidget.prototype, {
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

GSMA3G = {
  widget: {
    name: '3G Connections',
    description: 'Shows the percentage of mobile connections in a country that are 3G',
    url: 'https://gsmaintelligence.com/',
    dimensions: { width: 2, height: 1 },
    constructor: GSMA3GWidget,
    typeIcon: 'line-chart',
    category: 'access',
    country: 'single',
    countries: 'CountryInfo',
    settings: 'edit'
  },
  org: {
    name: 'GSMA Intelligence',
    shortName: 'GSMA Intelligence',
    url: 'https://gsmaintelligence.com/'
  }
};
