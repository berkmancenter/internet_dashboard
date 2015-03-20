Country = function(doc) {
  _.extend(this, doc);
};

Countries = new Mongo.Collection('imon_countries', {
  transform: function(doc) { return new Country(doc); }
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
    type: Number,
    decimal: true
  }
}));

IMonWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 1
  });

  var defaultData = {
    country: Countries.findOne({ code: 'usa' })
  };

  defaultData.indicator = this.fetchIndicatorForCountry(
      'Percentage of individuals using the Internet',
      defaultData.country.code
      );

  this.data = this.data || defaultData;
};

IMonWidget.prototype = Object.create(Widget.prototype);
IMonWidget.prototype.constructor = IMonWidget;

_.extend(IMonWidget.prototype, {
  onCountryChange: function(newCountry) {},
  getCountry: function() { return this.data.country; },
  fetchIndicatorForCountry: function(name, code) {
    var countryIndicators = Countries.findOne({ code: code }).indicators;
    return _.findWhere(countryIndicators, { name: name });
  },
  fetchIndicator: function(name) {
    return this.fetchIndicatorForCountry(name, this.getCountry().code);
  }
});

IMon = {
  displayName: 'Internet Monitor',
  description: 'Internet Monitor data for countries',
  referenceUrl: 'http://thenetmonitor.org',
  constructor: IMonWidget,
  requiredPubs: function() { return ['imon_countries']; },
};
