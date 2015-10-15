if (Meteor.settings.doJobs) {
  var cleanerType = 'job-cleaner';
  var job = new WidgetJob(cleanerType);
  job.repeat({ wait: WidgetJob.Settings.cleanEvery }).save({cancelRepeats: true});

  var clean = function(job, callback) {
    var removableJobs = WidgetJobs.find(
      { status: { $in: ['completed', 'cancelled'] } },
      {
        fields: { _id: 1 },
        sort: { updated: -1 },
        skip: WidgetJob.Settings.numKeepCompleted
      }
    ).fetch();
    var jobIds = _.pluck(removableJobs, '_id');
    if (jobIds.length > 0) {
      console.log('Widget: Removing ' + jobIds.length + ' old jobs');
      WidgetJobs.remove({ _id: { $in: jobIds } });
    }

    job.done();
    callback();
  };

  Meteor.startup(function() {
    Job.processJobs(WidgetJob.Settings.queueName, cleanerType, clean);
  });
}

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
              callback();
            }
        );
      });
    });
  });
}
