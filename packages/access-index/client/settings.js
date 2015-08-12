Template.AccessIndexSettings.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.AccessIndexSettings.helpers({
  countries: function() { return IMonCountries.find({}, { sort: { name: 1 } }); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.AccessIndexSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: IMonCountries.findOne({ code: countryCode })
    };
    template.closeSettings();
    this.set(newData);
  }
});
