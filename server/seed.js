Meteor.startup(function() {
  var installedWidgetPackages = WidgetTypes.find()
    .map(function(w) { return w.packageName; })
    .sort();

  var requestedWidgetPackages = WidgetPackages.slice(0).sort();

  if (!_.isEqual(installedWidgetPackages, requestedWidgetPackages)) {
    Widgets.seed(WidgetPackages);
  }
});
