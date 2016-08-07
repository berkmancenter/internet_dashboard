Settings = {
  defaultCountry: { iso2: 'US', iso3: 'USA', name: 'United States' },
  metric: '/metrics?id=53',
  attr: '/attributes?id=799'
};

GSMA4GWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    country: Settings.defaultCountry,
  });
};

GSMA4GWidget.prototype = Object.create(Widget.prototype);
GSMA4GWidget.prototype.constructor = GSMA4GWidget;

_.extend(GSMA4GWidget.prototype, {
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

GSMA4G = {
  widget: {
    name: '4G Connections',
    description: 'Shows the percentage of mobile connections in a country that are 4G',
    url: 'https://gsmaintelligence.com/',
    dimensions: { width: 2, height: 1 },
    constructor: GSMA4GWidget,
    typeIcon: 'line-chart',
    category: 'access',
    country: 'single'
  },
  org: {
    name: 'GSMA Intelligence',
    shortName: 'GSMA Intelligence',
    url: 'https://gsmaintelligence.com/'
  }
};
