Meteor.startup(function() {
  if (WidgetTypes.find().count() === 0) {
    Widgets.seed(WidgetPackages);
  }
});
