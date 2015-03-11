Template.IMonSettings.helpers({
  countries: function() { return Countries.find({}); },
  isSelectedCountry: function(code) { return this.country.code === code; },
  isSelectedIndicator: function(name) { return this.indicator.name === name; }
});

Template.IMonSettings.events({
  'click .save-settings': function(event, template) {
    var countryCode = template.find('.country').val(),
        indicator = template.find('.indicator').val();
    //this.close();
    this.set({
      country: countryCode,
      indicator: { name: indicator }
    });
  }
});

define(['app/setting_view', 'underscore', 'text!imon/templates/settings.html'],
  function(SettingView, _, templateContents) {
    return SettingView.extend({
      template: _.template(templateContents),
      events: {
        'click .save-settings': 'onSave'
      },
      onSave:     });
  }
);
