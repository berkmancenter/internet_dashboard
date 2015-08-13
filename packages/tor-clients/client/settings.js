Template.TorClientsSettings.onCreated(function() {
  this.countries = new Mongo.Collection('tor_countries');
  this.subscribe('tor_countries');
});

Template.TorClientsSettings.helpers({
  countries: function() { return Template.instance().countries.find(); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.TorClientsSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = { countryCode: countryCode };
    this.set(newData);
    template.closeSettings();
  }
});
