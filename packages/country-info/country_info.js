CountryInfo = {
  byCode: function(code, callback) {
    Meteor.call('countryByCode', code, function(error, result) {
      callback && callback(result);
    });
  }
};
