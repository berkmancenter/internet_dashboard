Settings = {
  indicatorName: 'Percentage of individuals using the Internet'
};

PercentOnlineWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 1
  });

  if (this.data.isEmpty()) {
    var self = this;
    Meteor.subscribe('imon_countries', function() {
      self.data.set({
        country: IMonCountries.findOne({ code: 'usa' })
      });
    });
  }
};

PercentOnlineWidget.prototype = Object.create(Widget.prototype);
PercentOnlineWidget.prototype.constructor = PercentOnlineWidget;

_.extend(PercentOnlineWidget.prototype, {
  // FIXME Implement this
  onCountryChange: function(newCountry) { return true; },
  getCountry: function() {
    return IMonCountries.findOne({ code: this.data.country.code });
  },
  getIndicator: function() {
    return _.findWhere(this.getCountry().indicators, { name: Settings.indicatorName });
  }
});

PercentOnline = {
  widget: {
    name: 'Percent Online',
    description: 'Shows the percent of a country\'s population using the Internet regularly',
    url: 'https://thenetmonitor.org/sources',
    constructor: PercentOnlineWidget
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'Internet Monitor',
    url: 'http://thenetmonitor.org'
  }
};
