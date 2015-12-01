CountryInfo = {
  byCode: function(code, callback) {
    Meteor.call('countryByCode', code, function(error, result) {
      callback && callback(result);
    });
  },
  byName: function(name, callback) {
    Meteor.call('countryByFuzzyName', name, function(error, result) {
      callback && callback(error, result);
    });
  },
  languageByCode: function(code, callback) {
    Meteor.call('languageByCode', code, function(error, result) {
      callback && callback(result);
    });
  },
  languageDirection: function(code, callback) {
    code = code.toLowerCase();
    var isRtl = !!_.find(rtlLanguages, function(language) {
      return language.alpha3 === code ||
        (language.alpha2 && language.alpha2 === code);
    });
    return isRtl ? 'rtl' : 'ltr';
  },
  languages: function(countryCode, callback) {
    Meteor.call('languages', countryCode, function(error, result) {
      callback && callback(result);
    });
  },
  shapes: function(callback) {
    Meteor.call('countryShapes', function(error, result) {
      callback && callback(result);
    });
  },
  population: function(code, callback) {
    Meteor.call('populationByCode', code, function(error, result) {
      callback && callback(result);
    });
  }
};
