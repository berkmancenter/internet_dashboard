Meteor.startup(function() {
  // Add standard widget event handlers to all the widget templates
  _.each(WidgetPackages, function(packageName) {
    var exports = _.first(_.keys(Package[packageName])),
        exported = Package[packageName][exports];

    //Template[exports + 'Widget'].events(Widgets.widgetTemplateEvents);
  });
});
