Template.HerdictSettings.helpers({
  countries: function() { return CountryInfo.countries; },
  categories: function() { return Settings.categories; },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.HerdictSettings.events({
  'click .save-settings': function(ev, template) {
    var country = {
      code: template.find('.country').value,
      name: template.find('.country').selectedOptions[0].innerText
    };
    var category = {
      code: template.find('.category').value,
      name: template.find('.category').selectedOptions[0].innerText
    };
    var newData = {
      country: country,
      category: category
    };
    template.closeSettings();
    this.set(newData);
  }
});
