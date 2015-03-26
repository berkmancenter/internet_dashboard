Meteor.publish('percent_online', function() {
  return IMonCountries.find({}, { fields: { indicators: {
      $elemMatch: { name: 'Percentage of individuals using the Internet' }
  }}});
});
