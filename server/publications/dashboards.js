Meteor.publish('dashboard', function(id) {
  return Dashboards.find(id);
});

Meteor.publish('availableWidgets', function() {
  return Widgets.find({});
});
