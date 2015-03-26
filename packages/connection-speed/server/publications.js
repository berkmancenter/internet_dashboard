Meteor.publish('connection_speed', function() {
  return IMonCountries.find({}, { fields: { indicators: {
      $elemMatch: { name: Settings.indicatorName }
  }}});
});
