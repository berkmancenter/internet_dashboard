WidgetJob = function(type, data) {
  data = data || {};
  Job.call(this, WidgetJobs, type, data);
};
WidgetJob.prototype = Object.create(Job.prototype);
WidgetJob.prototype.constructor = WidgetJob;

_.extend(WidgetJob, {
  Settings: {
    queueName: 'widgetJobQueue',
    pollEvery: 1 * 1000,
  },
  exists: function(type, data) {
    data = data || {};
    return WidgetJobs.find({ type: type, data: data }).count() > 0;
  }
});

var WidgetJobs = JobCollection(WidgetJob.Settings.queueName);
WidgetJobs._createCappedCollection(6 * 1024 * 1024, 500);

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
