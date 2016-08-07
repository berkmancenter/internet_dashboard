Settings = {
  gaugeWidth: 146, // per unit width
  defaultData: {
    country: 'usa',
    byYear: false,
    chosenYear: '',
    indicatorName: 'speedkbps', // Average connection speed (kbps)
    color: '#6192BD'
 }
};

IMonSpeedometerWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonSpeedometerWidget.prototype = Object.create(Widget.prototype);
IMonSpeedometerWidget.prototype.constructor = IMonSpeedometerWidget;

_.extend(IMonSpeedometerWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      var code = country.alpha3.toLowerCase();
      var country = IMonCountries.findOne({ code: code });
      if (country) {
        widget.data.set({ country: code });
      }
    });
  }
});


IMonSpeedometer = {
  widget: {
    name: 'Speedometer',
    description: "Shows connection speed-related data in a selected country.",
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 2, height: 2 },
    resize: { mode: 'cover' },
    typeIcon: 'tachometer',
    constructor: IMonSpeedometerWidget,
    indicators: 'speed',
    country: 'single'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
