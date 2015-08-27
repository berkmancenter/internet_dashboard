var data = Npm.require('country-data');
_.each(data.continents, function(continent, machineName) {
  continent.machineName = machineName;
});

Meteor.methods({
  countryByCode: function(code) {
    var country = data.countries[code.toUpperCase()];
    var continent = _.find(data.continents, function(continent) {
      return _.contains(continent.countries, country.alpha2);
    });
    country.continent = _.pick(continent, ['name', 'regions', 'machineName']);
    return country;
  }
});
