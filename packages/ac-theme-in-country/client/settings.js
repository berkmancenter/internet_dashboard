import { ACCountryProfiles } from 'meteor/accesscheck-data';

Template.ThemeInCountrySettings.onCreated(function() {
  this.subscribe('ac.countries');
});

Template.ThemeInCountrySettings.onRendered(function(){
  var template = this;
  var id = Template.instance().data.widget._id;
});

Template.ThemeInCountrySettings.helpers({
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  countries: function() {
    return ACCountryProfiles.find({},
        { fields: { country_code: 1, name: 1 }, sort: { name: 1 }}).fetch();
  }
});

Template.ThemeInCountrySettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: { code: countryCode }
    };
    this.set(newData);
    template.closeSettings();
  }
});
