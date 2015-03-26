var fetchIndicators = function(country) {
  var url = 'https://thenetmonitor.org/countries/' + country.code + '/access';
  HTTP.get(url, function (error, result) {
    if (!error && result.statusCode === 200) {
      var env = Npm.require('jsdom').env;
      env(result.content, Meteor.bindEnvironment(function(error, window) {
        var $ = Npm.require('jquery')(window);
        $('.indicators dt > span > a').each(function() {
          country.indicators.push({
            name: $(this).text(),
            value: parseFloat(
              $(this).parent().parent().next().find('.indicator-bar-inner').data('value')
            )
          });
          IMonCountries.update(country._id, { $set: { indicators: country.indicators } });
        });
      }));
    }
  });
};

IMonCountries.seedCountries = function() {
  HTTP.get('https://thenetmonitor.org/countries/usa/access', function (error, result) {
    if (!error && result.statusCode === 200) {
      var env = Npm.require('jsdom').env;
      env(result.content, Meteor.bindEnvironment(function(error, window) {
        var $ = Npm.require('jquery')(window);
        $('.countries-nav-list a', result.content).each(function() {
          var r = new RegExp('/countries/([a-z]{3})/');
          IMonCountries.insert({
            name: $(this).text(),
            code: r.exec($(this).attr('href'))[1],
            indicators: []
          }, function(error, id) {
            fetchIndicators(IMonCountries.findOne(id));
          });
        });
      }));
    }
  });
};

if (IMonCountries.find().count() === 0) {
  IMonCountries.seedCountries();
}

Meteor.publish('imon_countries', function() {
  return IMonCountries.find();
});
