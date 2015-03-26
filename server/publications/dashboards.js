Meteor.publish('dashboard', function(id) {
  return Dashboards.find(id);
});
