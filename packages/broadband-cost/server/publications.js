Meteor.publish('broadband_cost', function() {
  return IMonCountries.find({}, { fields: { indicators: {
      $elemMatch: { name: Settings.indicatorNames }
  }}});
});
