Meteor.startup(function() {
  if (Widgets.find({}).count() > 0) {
    return;
  }

  _.each(WidgetPackages, function(packageName) {
    var exports = _.first(_.keys(Package[packageName])),
        exported = Package[packageName][exports];

    Widgets.insert({
      fromPackage     : packageName,
      exports         : exports,
      displayName     : exported.displayName,
      description     : exported.description,
      referenceUrl    : exported.referenceUrl,
      allPublications : exported.allPublications
    });
  });
});
