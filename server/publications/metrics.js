Meteor.publish('widgetCounts', function() {
  var pub = this;
  var initializing = true;

  var getCount = function(packageName) {
    var count = {};
    if (packageName) {
      count[packageName] = {
        numInstances: Widgets.find({ packageName: packageName }).count()
      };
    } else {
      WidgetPackages.find().forEach(function(widgetPackage) {
        count[widgetPackage.packageName] = {
          numInstances:
            Widgets.find({ packageName: widgetPackage.packageName }).count()
        };
      });
    }
    return count;
  };

  var handle = Widgets.find().observeChanges({
    added: function (id, fields) {
      if (!initializing) {
        var newData = getCount(fields.packageName)[fields.packageName];
        pub.changed('widget_counts', fields.packageName, newData);
      }
    },
    removed: function (id) {
      _.each(getCount(), function(data, packageName) {
        pub.changed('widget_counts', packageName, data);
      });
    }
  });

  initializing = false;
  WidgetPackages.find().forEach(function(widgetPackage) {
    pub.added('widget_counts', widgetPackage.packageName,
        _.extend({ name: widgetPackage.metadata().widget.name },
          getCount(widgetPackage.packageName)[widgetPackage.packageName]));
  });

  pub.ready();
});

Meteor.publish('metrics', function() {
  var pub = this;

  if (!Roles.userIsInRole(pub.userId, Roles.ADMIN)) {
    pub.stop();
    return;
  }

  var initializing = true;

  var countData = function() {
    return {
      numUsers: Meteor.users.find({}).count(),
      numDashboards: Dashboards.find({}).count(),
    };
  };

  var userHandle = Meteor.users.find().observeChanges({
    added: function (id) {
      if (!initializing)
        pub.changed('metrics', 'metrics-counts', countData());
    },
    removed: function (id) {
      pub.changed('metrics', 'metrics-counts', countData());
    }
  });

  var dashboardHandle = Dashboards.find().observeChanges({
    added: function (id) {
      if (!initializing)
        pub.changed('metrics', 'metrics-counts', countData());
    },
    removed: function (id) {
      pub.changed('metrics', 'metrics-counts', countData());
    }
  });

  initializing = false;
  pub.added('metrics', 'metrics-counts', countData());
  pub.ready();

  pub.onStop(function () {
    userHandle.stop();
    dashboardHandle.stop();
  });

  //Roles.
});

