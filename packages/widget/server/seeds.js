Widgets.seed = function(packages) {
  _.each(packages, function(packageName, i) {
    if (_.isUndefined(Package[packageName])) {
      console.log('Package "' + packageName + '" does not exist in this project.');
      return;
    }

    var exports = _.first(_.keys(Package[packageName])),
        exported = Package[packageName][exports];

    var data = {
      packageName : packageName,
      exportedVar : exports,
      sortPosition: i,
      widget      : _.omit(exported.widget, 'constructor'),
      org         : exported.org
    };

    // This isn't an upsert so simple schema sets default values.
    if (WidgetPackages.find({ packageName: packageName }).count() > 0) {
      // So we don't squash nested attributes
      data = Npm.require('flatten-obj')()(data);
      WidgetPackages.update({ packageName: packageName }, { $set: data });
    } else {
      WidgetPackages.insert(data);
    }
  });

  // Remove widgets that are no longer listed
  WidgetPackages.find().forEach(function(package) {
    if (!_.include(packages, package.packageName)) {
      console.log('Widget: Removing package ' + package.packageName);
      WidgetPackages.remove(package._id);
    }
  });
  console.log('Widget: Updated widget packages');
};

// Remove all widgets that use this package if the package gets removed
WidgetPackages.find().observe({
  removed: function(removedPackage) {
    Widgets.remove({ packageName: removedPackage.packageName });
  }
});
