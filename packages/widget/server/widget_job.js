WidgetJob = function(type, data) {
  Job.call(this, widgetJobs, type, data);
};
WidgetJob.prototype = Object.create(Job.prototype);
WidgetJob.prototype.constructor = WidgetJob;

_.extend(WidgetJob, {
  Settings: {
    queueName: 'widgetJobQueue'
  },
  exists: function(type, data) {
    return WidgetJobs.find({ type: type, data: data }).count() > 0;
  }
});

var WidgetJobs = JobCollection(WidgetJob.Settings.queueName);

// Start all the job workers working
if (Meteor.settings.doJobs) {
  Meteor.startup(function() {
    WidgetJobs.startJobServer();

    WidgetPackages.find({}).forEach(function(widgetPackage) {
      var metadata = widgetPackage.metadata();
      if (!metadata.jobs) { return; }
      _.each(metadata.jobs, function(worker, type) {
        Job.processJobs(WidgetJob.Settings.queueName, type,
        function (job, callback) {
          worker(job.data);
          callback && callback();
        });
      });
    });
  });
}
