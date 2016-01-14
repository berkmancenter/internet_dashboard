Template.PercentOnBroadbandSettings.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.PercentOnBroadbandSettings.helpers({
  countries: function() { return findAreas(false); },
  regions: function() { return findAreas(true); },
  showRegions: function() { return findAreas(true).count() > 0; }
});

Template.PercentOnBroadbandSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: IMonCountries.findOne({ code: countryCode })
    };
    template.closeSettings();
    this.set(newData);
  }
});

Template.AdoptionOption.helpers({
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

function findAreas(isRegion) {
  isRegion = isRegion || false;
  return IMonCountries.find(
      { isRegion: isRegion, dataSources: Settings.indicatorId },
      { sort: { name: 1 } });
}
