Settings = {
  indicatorName: 'Percentage of individuals using the Internet',
  defaultCountry: { name: 'United States', code: 'usa' }
};

PercentOnlineWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, { country: Settings.defaultCountry });
};

PercentOnlineWidget.prototype = Object.create(Widget.prototype);
PercentOnlineWidget.prototype.constructor = PercentOnlineWidget;

_.extend(PercentOnlineWidget.prototype, {
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

PercentOnline = {
  widget: {
    name: 'Percent Online',
    description: 'Shows the percent of a country\'s population using the Internet regularly',
    url: 'https://thenetmonitor.org/sources#itu',
    dimensions: { width: 2, height: 1 },
    constructor: PercentOnlineWidget,
    typeIcon: 'th',
    category: 'access'
  },
  org: {
    name: 'International Telecommunications Union',
    shortName: 'ITU',
    url: 'http://www.itu.int/'
  }
};
