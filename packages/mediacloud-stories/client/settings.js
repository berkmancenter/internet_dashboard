Template.MediaCloudStoriesSettings.helpers({
  countries: function() { return Settings.tagSet; },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.MediaCloudStoriesSettings.events({
  'click .save-settings': function(ev, template) {
    var country = {
      code: template.find('.country').value,
      name: template.find('.country').selectedOptions[0].innerText
    };
    var term = template.$('#mc-term').val();
    var newData = { country: country, term: term };
    this.set(newData);
    template.closeSettings();
  }
});
