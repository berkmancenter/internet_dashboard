Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId });
  } else {
    this.ready();
  }
});

Meteor.publish('userDashboards', function() {
  if (this.userId) {
    return Dashboards.find({ ownerId: this.userId });
  } else {
    this.ready();
  }
});
