Country = function(doc) {
  _.extend(this, doc);
};

Countries = new Mongo.Collection('imon_countries', {
  transform: function(doc) { return new Country(doc); }
});

_.extend(Country.prototype, {
  fetchIndicators: function() {
    var country = this;
    request('https://thenetmonitor.org/countries/' + country.code + '/access',
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          $('.indicators dt > span > a', body).each(function() {
            country.indicators.push({
              name: $(this).text(),
              value: parseFloat($(this).parent().parent().next().find('.indicator-bar-inner').data('value'))
            });
          });
        }
      }
    );
    Countries.update(this._id, this);
  }
});

Countries.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  indicators: {
    type: [Object]
  },
  'indicators.$.name': {
    type: String
  },
  'indicators.$.value': {
    type: Number
  }
}));

Countries.seedCountries = function() {
  return function() {
  request('https://thenetmonitor.org/countries/usa/access', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $('.countries-nav-list a', body).each(function() {
        var r = new RegExp('/countries/([a-z]{3})/');
        Countries.insert({
          name: $(this).text(),
          code: r.exec($(this).attr('href'))[1],
          indicators: []
        }, function(error, id) {
          Countries.findOne(id).fetchIndicators();
        });
      });
    }
  });
  };
};
