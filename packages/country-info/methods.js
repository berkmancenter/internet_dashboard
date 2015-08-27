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
  },
  languageByCode: function(code) {
    return _.findWhere(data.languages, { alpha3: code.toLowerCase() });
  },
  languages: function(countryCode) {
    var languageCodes = data.countries[countryCode.toUpperCase()].languages;
    var languages = _.filter(data.languages, function(language) {
      return _.contains(languageCodes, language.alpha3);
    });
    return languages;
  }
});
