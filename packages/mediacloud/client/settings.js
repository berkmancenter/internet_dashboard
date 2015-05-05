Template.MediaCloudSettings.helpers({
  countries: function() { return Settings.tagSet },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.MediaCloudSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    console.log(template.find('.country'));
    var newData = {
      country: { code: countryCode, name: 'Test' }
    };
    this.closeSettings(template);
    this.set(newData);
  }
});
