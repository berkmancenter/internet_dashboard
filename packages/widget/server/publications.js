Meteor.publish('dashboardWidgets', function(dashboardId) {
  return Widgets.find({ dashboardId: dashboardId });
});

Meteor.publish('activeWidgets', function() {
  return WidgetPackages.find();
});
