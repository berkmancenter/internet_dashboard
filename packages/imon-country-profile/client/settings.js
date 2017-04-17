Template.ImonCountryProfileSettings.onCreated(function() {
  this.subscribe('imon_countries_v2');
});

Template.ImonCountryProfileSettings.helpers({
  countries: function() {
    return IMonCountries.find({}, { sort: { name: 1 } });
  },
  iprIndicator: function() {
    let selector = { countryCode: this.data.country.code, indAdminName: 'ipr' };
    return IMon.findOne(selector, { sort: { date: -1 }});
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.ImonCountryProfileSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: IMonCountries.findOne({ code: countryCode }),
    };
    template.closeSettings();
    this.set(newData);
  }
});
