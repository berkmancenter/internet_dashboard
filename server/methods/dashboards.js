Meteor.methods({
  newDashboard: function() {
    return Dashboards.insert(new Dashboard());
  }
});

