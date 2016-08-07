Settings = {
  icons: { // hash of indicator IDs : icons for when it's not 'user' / person.
    hhnet: 'home',
    edf: 'female',
    edm: 'male'
  },
  defaultData: {
    country: 'usa',
    byYear: false,
    chosenYear: '',
    indicatorName: 'bbrate',
    color: '#6192BD'
  }
};

IMonPercentWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonPercentWidget.prototype = Object.create(Widget.prototype);
IMonPercentWidget.prototype.constructor = IMonPercentWidget;

_.extend(IMonPercentWidget.prototype, {
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

IMonPercent = {
  widget: {
    name: 'Percentage',
    description: 'Visualizes percentage indicators.', // temp
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 2, height: 2 },
    resize: { mode: 'cover', constraints: { height: { min: 2 } } },
    constructor: IMonPercentWidget,
    typeIcon: 'th',
    indicators: 'percentage',
    country: 'single'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
