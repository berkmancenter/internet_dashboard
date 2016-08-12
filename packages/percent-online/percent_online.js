Settings = {
  indicatorName: 'Percentage of individuals using the Internet',
  indicatorId: 'ipr',
  defaultData: { name: 'United States', code: 'usa', byYear: false, chosenYear: ''}
};

PercentOnlineWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, { country: Settings.defaultData});
};

PercentOnlineWidget.prototype = Object.create(Widget.prototype);
PercentOnlineWidget.prototype.constructor = PercentOnlineWidget;

_.extend(PercentOnlineWidget.prototype, {
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
    var IMon = this.data.byYear ? IMonData : IMonRecent;
    var selector = { countryCode: this.data.country.code, indAdminName: Settings.indicatorId };
    var year = this.data.chosenYear;
    if(this.data.byYear){ selector.$where = function(){ return this.date.getFullYear()===year; }; }
    return IMon.findOne(selector, { sort: { date: -1 } });
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
