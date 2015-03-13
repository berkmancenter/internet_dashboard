Meteor.startup(function() {
  _.each(widgetPackages, function(packageName) {
    var exports = _.first(_.keys(Package[packageName])),
        exported = Package[packageName][exports];

    Template[exports + 'Widget'].events(Widgets.widgetTemplateEvents);
  });
});
