Meteor.publish('imon_indicators', function() {
  var publication = this;
  var pipeline = { $group: { _id: '$name', name: { $first: '$name' }}};
  var indicators = IMonData.aggregate(pipeline);
  indicators.forEach(function(i) {
    publication.added('imon_indicators', i._id, i);
  });
  publication.ready();
});

Meteor.publish('imon_countries', function() {
  return IMonCountries.find();
});

Meteor.publish('imon_data', function(countryCode, indicators) {
  var selector = {};
  if (!_.isUndefined(countryCode) && countryCode !== 'all') {
    selector.countryCode = countryCode;
  }
  if (_.isArray(indicators)) { selector.name = { $in: indicators }; }
  if (_.isString(indicators)) { selector.name = indicators; }
  return IMonData.find(selector);
});

