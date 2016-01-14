Template.PercentOnlineSettings.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.PercentOnlineSettings.helpers({
  regions: function() {
    return IMonCountries.find(
        { isRegion: true, dataSources: Settings.indicatorId },
        { sort: { name: 1 } });
  },
  countries: function() {
    return IMonCountries.find(
        { isRegion: false, dataSources: Settings.indicatorId },
        { sort: { name: 1 } });
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.PercentOnlineSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: IMonCountries.findOne({ code: countryCode })
    };
    template.closeSettings();
    this.set(newData);
  }
});
