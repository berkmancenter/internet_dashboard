Settings = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  suffix: {
    percentage: '%',
    speed: 'kbps'
  },
  defaultData: {
   country: 'usa',
   indicatorName: 'hhnet',
   color: '#2ca02c'
 }
};

IMonValuetrendWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonValuetrendWidget.prototype = Object.create(Widget.prototype);
IMonValuetrendWidget.prototype.constructor = IMonValuetrendWidget;

_.extend(IMonValuetrendWidget.prototype, {
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

IMonValuetrend = {
  widget: {
    name: 'Value-Trend',
    description: 'Shows value of an indicator for a specific country and its trend over time.',
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 3, height: 1 },
    constructor: IMonValuetrendWidget,
    typeIcon: 'line-chart',
    resize: { mode: 'cover', constraints: { height: { max: 1 } } },
    indicators: 'all',
    country: 'single',
    countries: 'all',
    settings: 'change country/indicator'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
