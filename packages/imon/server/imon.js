Countries = Mongo.Collection('imon_countries');

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
  request('https://thenetmonitor.org/countries/usa/access', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $('.countries-nav-list a', body).each(function() {
        var r = new RegExp('/countries/([a-z]{3})/');
        Countries.insert({
          name: $(this).text(),
          code: r.exec($(this).attr('href'))[1],
          indicators: []
        });
      });
    }
  });
};
