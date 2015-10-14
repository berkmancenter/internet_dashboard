WidgetJobs._createCappedCollection(6 * 1024 * 1024, 500);

TabularJobCollections.authenticateMethods = function (userId) {
  return Roles.userIsInRole(userId, Roles.ADMIN);
};

// Start all the job workers working
if (Meteor.settings.doJobs) {
  Meteor.startup(function() {
    console.log('Widget: Starting job server');
    WidgetJobs.startJobServer();
    WidgetJobs.promote(WidgetJob.Settings.pollEvery);

    WidgetPackages.find({}).forEach(function(widgetPackage) {
      var metadata = widgetPackage.metadata();
      if (!metadata.widget.jobs) { return; }
      _.each(metadata.widget.jobs, function(worker, type) {
        WidgetJobs.processJobs(type,
            { pollInterval: WidgetJob.Settings.pollEvery },
            function (job, callback) {
              worker(job.data);
              job.done();
              callback && callback();
            }
        );
      });
    });
  });
}
