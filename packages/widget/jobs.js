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
    cleanEvery: 5 * 60 * 1000,
    numKeepCompleted: 10,
  },
  exists: function(type, data) {
    data = data || {};
    return WidgetJobs.find({ type: type, data: data }).count() > 0;
  }
});

WidgetJobs = JobCollection(WidgetJob.Settings.queueName);

var jobCollections = {};
jobCollections[WidgetJob.Settings.queueName] = {
  collection: WidgetJobs,
  allow: function (userId) {
    return Roles.userIsInRole(userId, Roles.ADMIN);
  }
};

TabularJobCollections(jobCollections);
