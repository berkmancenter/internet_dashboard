Meteor.methods({
  newDashboard: function() {
    var userId = Meteor.userId();
    var dashboard = {};

    if (userId) {
      _.extend(dashboard, {
        ownerId: userId,
        editorIds: [userId],
        publiclyEditable: false
      });
    }

    var newDash = new Dashboard(dashboard);
    return Dashboards.insert(newDash);
  }
});

