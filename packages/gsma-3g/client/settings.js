Template.GSMA3GSettings.helpers({
  countries: function() { return CountryInfo.countries; },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.GSMA3GSettings.events({
  'click .save-settings': function(ev, template) {
    var widgetData = this;
    var iso2 = template.find('.country').value;
    CountryInfo.byCode(iso2, function(country) {
      if (_.isUndefined(country)) {
        template.closeSettings();
        return;
      }
      var iso3 = country.alpha3.toUpperCase();
      widgetData.set({
        country: {
          iso2: iso2,
          iso3: iso3,
          name: country.name
        }
      });
      template.closeSettings();
    });
  }
});
