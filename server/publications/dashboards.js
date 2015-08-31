Meteor.publish('dashboard', function(id) {
  var dashboard = Dashboards.findOne(id);
  var currentUser = Meteor.users.find(this.userId);
  if (dashboard.editableBy(currentUser)) {
    return [
      Dashboards.find(id),
      Meteor.users.find(dashboard.ownerId, { fields: { username: 1 } })
    ];
  }
  return Dashboards.find(id);
});
