_.extend(Country.prototype, {
  fetchIndicators: function() {
    var country = this;
    HTTP.get('https://thenetmonitor.org/countries/' + country.code + '/access', function (error, result) {
      if (!error && result.statusCode == 200) {
        var env = Npm.require('jsdom').env;
        env(result.content, Meteor.bindEnvironment(function(error, window) {
          var $ = Npm.require('jquery')(window);
          $('.indicators dt > span > a').each(function() {
            country.indicators.push({
              name: $(this).text(),
              value: parseFloat($(this).parent().parent().next().find('.indicator-bar-inner').data('value'))
            });
            Countries.update(country._id, { $set: { indicators: country.indicators } });
          });
        }));
      }
    });
  }
});

Countries.seedCountries = function() {
  HTTP.get('https://thenetmonitor.org/countries/usa/access', function (error, result) {
    console.log(error);
    if (!error && result.statusCode == 200) {
      var env = Npm.require('jsdom').env;
      env(result.content, Meteor.bindEnvironment(function(error, window) {
        var $ = Npm.require('jquery')(window);
        $('.countries-nav-list a', result.content).each(function() {
          var r = new RegExp('/countries/([a-z]{3})/');
          Countries.insert({
            name: $(this).text(),
            code: r.exec($(this).attr('href'))[1],
            indicators: []
          }, function(error, id) {
            Countries.findOne(id).fetchIndicators();
          });
        });
      }));
    }
  });
};

if (Countries.find({}).count() === 0) {
  Countries.seedCountries();
}

Meteor.publish('imon_countries', function() {
  return Countries.find({});
});
