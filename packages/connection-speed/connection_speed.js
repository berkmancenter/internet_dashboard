Settings = {
  indicatorName: 'Average connection speed (kbps)',
  indicatorId: 'speedkbps',
  gaugeWidth: 292,
  defaultData: { name: 'United States', code: 'usa', byYear: false, chosenYear: ''}
};

ConnectionSpeedWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, { country: Settings.defaultData });
};

ConnectionSpeedWidget.prototype = Object.create(Widget.prototype);
ConnectionSpeedWidget.prototype.constructor = ConnectionSpeedWidget;

_.extend(ConnectionSpeedWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      var code = country.alpha3.toLowerCase();
      country = IMonCountries.findOne({ code: code });
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

ConnectionSpeed = {
  widget: {
    name: 'Connection Speed',
    description: "Shows how quickly (in kilobits per second) data can be transferred from the Internet to a local computer",
    url: 'https://thenetmonitor.org/sources#akamai',
    dimensions: { width: 2, height: 2 },
    category: 'access',
    typeIcon: 'tachometer',
    constructor: ConnectionSpeedWidget
  },
  org: {
    name: 'Akamai Technologies, Inc.',
    shortName: 'Akamai',
    url: 'http://www.akamai.com/'
  }
};
