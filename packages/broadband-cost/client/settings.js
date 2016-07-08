Template.BroadbandCostSettings.onCreated(function() {
  this.subscribe('imon_countries_v2');
});

Template.BroadbandCostSettings.helpers({
  countries: function() { return IMonCountries.find({}, { sort: { name: 1 } });}
});

Template.BroadbandCostSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: {
        name: IMonCountries.findOne({ code: countryCode }).name,
        code: countryCode
      }
    };
    this.set(newData);
    template.closeSettings();
  }
});

Template.BroadbandOption.helpers({
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

