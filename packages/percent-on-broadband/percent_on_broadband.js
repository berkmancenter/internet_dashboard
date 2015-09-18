Settings = {
  indicatorName: 'Broadband adoption rate',
  defaultCountry: { name: 'United States', code: 'usa' }
};

PercentOnBroadbandWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, { country: Settings.defaultCountry });
};

PercentOnBroadbandWidget.prototype = Object.create(Widget.prototype);
PercentOnBroadbandWidget.prototype.constructor = PercentOnBroadbandWidget;

_.extend(PercentOnBroadbandWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      var code = country.alpha3.toLowerCase();
      var country = IMonCountries.findOne({ code: code });
      if (country) {
        widget.data.set({ country: country });
      }
    });
  },
  getIndicator: function() {
    var countryData = IMonCountryData.findOne({ code: this.data.country.code });
    return _.findWhere(countryData.indicators, { name: Settings.indicatorName });
  }
});

PercentOnBroadband = {
  widget: {
    name: 'Broadband Adoption',
    description: 'Shows the percent of a country\'s connections to Akamai with bandwidth greater than 4Mbps',
    url: 'https://thenetmonitor.org/sources#akamai',
    dimensions: { width: 2, height: 1 },
    constructor: PercentOnBroadbandWidget,
    typeIcon: 'th',
    category: 'access'
  },
  org: {
    name: 'Akamai Technologies, Inc.',
    shortName: 'Akamai',
    url: 'http://www.akamai.com/'
  }
};
