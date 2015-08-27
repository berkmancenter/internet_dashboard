CountryInfo = {
  byCode: function(code, callback) {
    Meteor.call('countryByCode', code, function(error, result) {
      callback && callback(result);
    });
  },
  languageByCode: function(code, callback) {
    Meteor.call('languageByCode', code, function(error, result) {
      callback && callback(result);
    });
  },
  languages: function(countryCode, callback) {
    Meteor.call('languages', countryCode, function(error, result) {
      callback && callback(result);
    });
  }
};
