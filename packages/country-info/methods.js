countries = Npm.require('country-data').countries;

Meteor.methods({
  countryByCode: function(code) {
    var country = countries[code.toUpperCase()];
    country.continent = _.find(continents, function(continent) {
      return _.contains(continent.countries, country.alpha2);
    });
    return country;
  }
});
