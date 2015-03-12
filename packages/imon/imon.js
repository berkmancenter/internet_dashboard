Widget = function(doc) {
  var defaults = {
    width: 2,
    height: 1,
    country: Country.findOne({ code: 'US' }),
    indicator: { name: 'Percentage of individuals using the Internet' },
  };
  _.extend(this, defaults, doc);
};

_.extend(Widget.prototype, {
  onCountryChange: function(newCountry) {}
});

IMon = {
  displayName: 'Internet Monitor',
  description: 'Internet Monitor data for countries',
  referenceUrl: 'http://thenetmonitor.org',
  constructor: Widget
};

Meteor.startup(Countries.seedCountries);
