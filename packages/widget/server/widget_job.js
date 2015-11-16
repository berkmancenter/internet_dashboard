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

    // Start all the job workers working
    console.log('Widget: Starting job server');
    WidgetJobs._ensureIndex({ updated: -1 });
    WidgetJobs._ensureIndex({ status: -1 });
    WidgetJobs.startJobServer();
    WidgetJobs.promote(WidgetJob.Settings.pollEvery);
    var jobOptions = {
      pollInterval: WidgetJob.Settings.pollEvery,
      concurrency: 2,
      workTimeout: 10 * 60 * 1000,
    };

    WidgetPackages.find().forEach(function(widgetPackage) {
      var widgetJobs = widgetPackage.metadata().widget.jobs;
      if (!widgetJobs) { return; }

      _.each(widgetJobs, function(worker, type) {
        var workerCall = function (job, callback) {
          try {
            worker(job.data);
            job.done();
          } catch (e) {
            console.error('Widget: Job error - ' + e);
            job.fail('' + e);
          }
          callback();
        };
        WidgetJobs.processJobs(type, jobOptions, workerCall);
      });
    });
  });
}

TabularJobCollections.authenticateMethods = function (userId) {
  return Roles.userIsInRole(userId, Roles.ADMIN);
};

var subCounter = new SubCounter();

_.extend(WidgetJob.prototype, {
  stopWhenNoSubsTo: function(publication) {
    var job = this;
    // Only add this callback once
    if (_.isEmpty(subCounter.callbacksOn('empty', publication))) {
      subCounter.onEmpty(publication, function() {
        WidgetJob.cancelLike(job.type, job.data);
      });
    }
  }
});

_.extend(WidgetJob, {
  trackSub: function(publication) {
    subCounter.count(publication);
  },
  exists: function(type, data) {
    data = data || {};
    var query = {
      type: type,
      data: data,
      status: { $in: ['running', 'ready', 'waiting'] }
    };
    return WidgetJobs.find(query).count() > 0;
  },
  cancelLike: function(type, data) {
    data = data || {};
    var query = {
      type: type,
      data: data,
      status: { $in: Job.jobStatusCancellable }
    };
    var jobs = WidgetJobs.find(query);
    WidgetJobs.cancelJobs(_.pluck(jobs.fetch(), '_id'));
  }
});
