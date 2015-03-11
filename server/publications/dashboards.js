Meteor.publish('dashboards', function(id) {
  return Dashboards.findOne(id);
});
