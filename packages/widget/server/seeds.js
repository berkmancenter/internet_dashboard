Widgets.seed = function(packages) {
  console.log('Widget: Updating widget packages');

  _.each(packages, function(packageName) {
    if (_.isUndefined(Package[packageName])) {
      console.log('Package "' + packageName + '" does not exist in this project.');
      return;
    }

    var exports = _.first(_.keys(Package[packageName])),
        exported = Package[packageName][exports];

    var data = {
      packageName : packageName,
      exportedVar : exports,
      widget      : _.omit(exported.widget, 'constructor'),
      org         : exported.org
    };

    // This isn't an upsert so simple schema sets default values.
    if (WidgetTypes.find({ packageName: packageName }).count() > 0) {
      // So we don't squash nested attributes
      data = Npm.require('flatten-obj')()(data);
      WidgetTypes.update({ packageName: packageName }, { $set: data });
    } else {
      WidgetTypes.insert(data);
    }
  });
};
