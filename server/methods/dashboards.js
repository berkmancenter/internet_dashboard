Meteor.methods({
  newDashboard: function() {
    var dashboard = new Dashboard({ ownerId: Meteor.userId() });
    return Dashboards.insert(dashboard);
  }
});

