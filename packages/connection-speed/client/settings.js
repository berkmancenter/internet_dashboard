Template.ConnectionSpeedSettings.onCreated(function() {
  this.subscribe('imon_countries_v2');
});

Template.ConnectionSpeedSettings.helpers({
  countries: function() { return IMonCountries.find({ dataSources: Settings.indicatorId }, { sort: { name: 1 } }); }
});

Template.ConnectionSpeedSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: IMonCountries.findOne({ code: countryCode })
    };
    template.closeSettings();
    this.set(newData);
  }
});

Template.ConnectionSpeedOption.helpers({
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});
