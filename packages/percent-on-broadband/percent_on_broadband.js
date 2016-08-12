Settings = {
  indicatorName: 'Broadband adoption rate',
  indicatorId: 'bbrate',
  defaultData: { name: 'United States', code: 'usa', byYear: false, chosenYear: '' }
};

PercentOnBroadbandWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, { country: Settings.defaultData });
};

PercentOnBroadbandWidget.prototype = Object.create(Widget.prototype);
PercentOnBroadbandWidget.prototype.constructor = PercentOnBroadbandWidget;

_.extend(PercentOnBroadbandWidget.prototype, {
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
    var chosenYear = this.data.chosenYear;
    var selector = { countryCode: this.data.country.code, indAdminName: Settings.indicatorId };
    if(this.data.byYear){ selector.$where = function(){ return this.date.getFullYear() === chosenYear; }; }
    return IMon.findOne(selector, { sort: { date: -1 } });
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
    category: 'access',
    indicators: [ Settings.indicatorId ],
    country: 'single',
    countries: Settings.indicatorId
  },
  org: {
    name: 'Akamai Technologies, Inc.',
    shortName: 'Akamai',
    url: 'http://www.akamai.com/'
  }
};
