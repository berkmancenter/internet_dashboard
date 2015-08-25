Meteor.publish('widget', function(widgetId) {
  return Widgets.find(widgetId);
});

Meteor.publish('widgetDashboard', function(widgetId) {
  return Dashboards.find(Widgets.findOne(widgetId).dashboardId);
});

Meteor.publish('dashboardWidgets', function(dashboardId) {
  return Widgets.find({ dashboardId: dashboardId });
});

Meteor.publish('activeWidgets', function() {
  return WidgetPackages.find();
});
