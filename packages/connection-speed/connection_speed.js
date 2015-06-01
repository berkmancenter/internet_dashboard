Settings = {
  indicatorName: 'Average connection speed (kbps)',
  gaugeWidth: 292
};

ConnectionSpeedWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 2
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

ConnectionSpeedWidget.prototype = Object.create(Widget.prototype);
ConnectionSpeedWidget.prototype.constructor = ConnectionSpeedWidget;

_.extend(ConnectionSpeedWidget.prototype, {
  // FIXME Implement this
  onCountryChange: function(newCountry) { return true; },
  getCountry: function() {
    return IMonCountries.findOne({ code: this.data.country.code });
  },
  getIndicator: function() {
    return _.findWhere(this.getCountry().indicators, { name: Settings.indicatorName });
  }
});

ConnectionSpeed = {
  widget: {
    name: 'Connection Speed',
    description: "Shows how quickly (in kilobits per second) data can be transferred from the Internet to a local computer",
    url: 'https://thenetmonitor.org/sources',
    constructor: ConnectionSpeedWidget,
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'Internet Monitor',
    url: 'http://thenetmonitor.org'
  }
};
