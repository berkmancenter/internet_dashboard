Meteor.startup(function() {
  if (WidgetTypes.find({}).count() > 0) {
    return;
  }

  _.each(WidgetPackages, function(packageName) {
    var exports = _.first(_.keys(Package[packageName])),
        exported = Package[packageName][exports];

    WidgetTypes.insert({
      packageName     : packageName,
      exportVar       : exports,
      displayName     : exported.displayName,
      description     : exported.description,
      referenceUrl    : exported.referenceUrl
    });
  });
});
