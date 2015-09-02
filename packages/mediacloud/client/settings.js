Template.MediaCloudSettings.helpers({
  countries: function() { return Settings.tagSet; },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.MediaCloudSettings.events({
  'click .save-settings': function(ev, template) {
    var country = {
      code: template.find('.country').value,
      name: template.find('.country').selectedOptions[0].innerText
    };
    var newData = { country: country };
    template.closeSettings();
    this.set(newData);
  }
});
