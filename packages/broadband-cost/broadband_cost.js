Settings = {
  indicatorNames: [
'Broadband subscription charge as a percentage of GDP per capita PPP (0-1 Mbps)',
'Broadband subscription charge as a percentage of GDP per capita PPP (>1-4 Mbps)',
'Broadband subscription charge as a percentage of GDP per capita PPP (>4-10 Mbps)',
'Broadband subscription charge as a percentage of GDP per capita PPP (>10-25 Mbps)',
'Broadband subscription charge as a percentage of GDP per capita PPP (>25 Mbps)',
]
};

BroadbandCostWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 1
  });

  if (this.data.isEmpty()) {
    var self = this;
    Meteor.subscribe('imon_countries', function() {
      self.data.set({
        country: IMonCountries.findOne({ code: 'usa' }),
        indicator: { name: Settings.indicatorNames[0] }
      });
      self.data.set({ indicator: self.getIndicator() });
    });
  }
};

BroadbandCostWidget.prototype = Object.create(Widget.prototype);
BroadbandCostWidget.prototype.constructor = BroadbandCostWidget;

_.extend(BroadbandCostWidget.prototype, {
  // FIXME Implement this
  onCountryChange: function(newCountry) { return true; },
  getCountry: function() {
    return IMonCountries.findOne({ code: this.data.country.code });
  },
  getIndicator: function() {
    return _.findWhere(this.getCountry().indicators, { name: this.data.indicator.name });
  }
});

BroadbandCost = {
  constructor: BroadbandCostWidget,
  displayName: 'Broadband Cost',
  description: "Shows an overall broadband cost index that aggregates the proportionate costs across each tier for each country",
  referenceUrl: 'http://thenetmonitor.org',
};
