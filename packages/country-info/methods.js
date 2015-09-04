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
  countryByFuzzyName: function(name) {
    var fuzziness = 0.5;
    var specialCases = [
      { code: 'VE', names: ['Venezuela'] },
      { code: 'BO', names: ['Bolivia'] },
      { code: 'SY', names: ['Syria'] },
      { code: 'LA', names: ['Laos'] }
    ];
    var names = _.chain(data.countries).pluck('name').compact().uniq().value();
    var matches = Fuzzy(name, names, fuzziness);
    if (matches.length > 0) {
      return _.findWhere(data.countries, { name: matches[0] });
    } else {
      names = _.chain(specialCases).pluck('names').flatten().value();
      matches = Fuzzy(name, names, fuzziness);
      if (matches.length > 0) {
        var code = _.find(specialCases, function(specialCase) {
          return _.contains(specialCase.names, name);
        }).code;
        return _.findWhere(data.countries, { alpha2: code });
      }
    }
  },
  countryShapes: function() {
    return Shapes;
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
