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
  },
  updateDashboard: function(id, attrs) {
    var dashboard = Dashboards.findOne(id);
    dashboard.authorize();
    var requiresOwnership = ['ownerId', 'editorIds', 'publiclyEditable'];
    if (!dashboard.isOwned()) {
      attrs = _.omit(attrs, requiresOwnership);
    }
    if (!_.isEmpty(attrs)) {
      console.log('Dashboard: Updating dashboard ' + id);
      Dashboards.update(dashboard._id, { $set: attrs });
    }
  }
});
