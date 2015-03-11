var widgetPackages = ['imon'];

Meteor.startup(function() {
  _.each(widgetPackages, function(packageName) {
    var exports = Package[packageName].getExports()[0].name,
        exported = Package[packageName][exports];
    Widgets.insert({
      fromPackage: packageName,
      exports: exports,
      displayName: exported.displayName,
      description: exported.description,
      referenceUrl: exported.referenceUrl
    });
  });
});
