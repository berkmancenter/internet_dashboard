Template.BroadbandCostSettings.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.BroadbandCostSettings.helpers({
  countries: function() { return findAreas(false); },
  regions: function() { return findAreas(true); },
  showRegions: function() { return findAreas(true).count() > 0; }
});

Template.BroadbandCostSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: IMonCountries.findOne({ code: countryCode })
    };
    this.set(newData);
    template.closeSettings();
  }
});

Template.BroadbandOption.helpers({
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

function findAreas(isRegion) {
  isRegion = isRegion || false;
  return IMonCountries.find(
      { isRegion: isRegion, dataSources: { $in: Settings.indicatorIds }},
      { sort: { name: 1 } });
}
