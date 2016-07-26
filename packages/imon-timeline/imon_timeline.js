Settings = {
  margins: { top: 10, bottom: 10, left: 30, right: 30 },
  colors: [
      { code: '#6192BD', name: 'Blue' },
      { code: '#27ae60', name: 'Green' },
      { code: '#f39c12', name: 'Orange' },
      { code: '#c0392b', name: 'Red' }
  ],
  defaultData: {
   mode: 'singleIndicator',
   country: ['usa','kor','can','hkg'],
   indicatorName: 'bbrate',
   color: '#6192BD'
 }
};

ONE_MONTH = 2.628e+9;

IMonTimelineWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonTimelineWidget.prototype = Object.create(Widget.prototype);
IMonTimelineWidget.prototype.constructor = IMonTimelineWidget;

_.extend(IMonTimelineWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      var code = country.alpha3.toLowerCase();
      var country = IMonCountries.findOne({ code: code });
      if (country && widget.data.mode === 'singleCountry') {
        widget.data.set({ country: code });
      }
    });
  }
});


IMonTimeline = {
  widget: {
    name: 'Timeline',
    description: 'Compare several country/indicator trends over time.',
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 4, height: 2 },
    constructor: IMonTimelineWidget,
    typeIcon: 'line-chart',
    resize: { mode: 'cover' }
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
