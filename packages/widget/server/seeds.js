Widgets.seed = function(packages) {
  _.each(packages, function(packageName) {
    var exports = _.first(_.keys(Package[packageName])),
        exported = Package[packageName][exports];

    WidgetTypes.insert({
      packageName     : packageName,
      exportedVar     : exports,
      displayName     : exported.displayName,
      description     : exported.description,
      referenceUrl    : exported.referenceUrl
    });
  });
};
