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
  languages: function(countryCode, callback) {
    Meteor.call('languages', countryCode, function(error, result) {
      callback && callback(result);
    });
  },
  shapes: function(callback) {
    Meteor.call('countryShapes', function(error, result) {
      callback && callback(result);
    });
  }
};
