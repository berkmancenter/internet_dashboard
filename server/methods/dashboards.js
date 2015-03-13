Meteor.methods({
  newDashboard: function() {
    return Dashboards.insert(new Dashboard());
  },
  addWidgetToDashboard: function(dashboardId, widget) {
    console.log(widget);
    Dashboards.update(dashboardId, { $push: { widgets: widget } });
  }
});

