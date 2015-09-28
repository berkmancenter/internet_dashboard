WidgetJob = function(type, data) {
  data = data || {};
  Job.call(this, WidgetJobs, type, data);
};
WidgetJob.prototype = Object.create(Job.prototype);
WidgetJob.prototype.constructor = WidgetJob;

_.extend(WidgetJob, {
  Settings: {
    queueName: 'widgetJobQueue'
  },
  exists: function(type, data) {
    data = data || {};
    return WidgetJobs.find({ type: type, data: data }).count() > 0;
  }
});

var WidgetJobs = JobCollection(WidgetJob.Settings.queueName);

// Start all the job workers working
if (Meteor.settings.doJobs) {
  Meteor.startup(function() {
    console.log('Widget: Starting job server');
    WidgetJobs.startJobServer();

    WidgetPackages.find({}).forEach(function(widgetPackage) {
      var metadata = widgetPackage.metadata();
      if (!metadata.widget.jobs) { return; }
      _.each(metadata.widget.jobs, function(worker, type) {
        Job.processJobs(WidgetJob.Settings.queueName, type,
        function (job, callback) {
          worker(job.data);
          callback && callback();
        });
      });
    });
  });
}
