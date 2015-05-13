var inDoc = function(url, func) {
  console.log('Fetching: ' + url);
  var callOptions = {};

  HTTP.get(url, callOptions, function (error, result) {
    if (!error && result.statusCode === 200) {
      var env = Npm.require('jsdom').env;
      env(result.content, Meteor.bindEnvironment(function(error, window) {
        var $ = Npm.require('jquery')(window);
        func.call(this, $);
      }));
    }
  });
};
var url = function(args) {
  var urlTemplate = 'http://herdict.org/explore/module/topsitescategory?40=&fc=<%= countryCode %>';
  return _.template(urlTemplate)(args);
};

var fetchHTML = function(url) {
  var result = HTTP.get(url);
  return result.content;
};

_.each(Countries, function(country) {
  var thisUrl = url({ countryCode: country.code });
  inDoc(thisUrl, function($) {
    $('h4').each(function() {
      console.log(this);
    });
  });
});
