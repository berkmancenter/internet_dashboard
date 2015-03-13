var widgetPackages = ['imon'];

Meteor.startup(function() {
  if (Widgets.find({}).count() > 0) {
    return;
  }

  _.each(widgetPackages, function(packageName) {
    var exports = _.first(_.keys(Package[packageName])),
        exported = Package[packageName][exports];

    Widgets.insert({
      fromPackage  : packageName,
      exports      : exports,
      displayName  : exported.displayName,
      description  : exported.description,
      referenceUrl : exported.referenceUrl,
      publications : exported.publications
    });

    if (!_.isUndefined(exported.onStartup)) {
      exported.onStartup();
    }
  });
});
