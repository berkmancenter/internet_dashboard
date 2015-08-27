countries = Npm.require('country-data').countries;

Meteor.methods({
  countryByCode: function(code) {
    return countries[code];
  }
});
