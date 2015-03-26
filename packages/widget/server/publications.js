Meteor.publish('dashboardWidgets', function(dashboardId) {
  return Widgets.find({ dashboardId: dashboardId });
});

Meteor.publish('availableWidgets', function() {
  return WidgetTypes.find({});
});
