var Future = Npm.require('fibers/future');

DataJob = function(options) {
  var self = this;
  self.func = options.func;
  self.name = options.name;
  self.runEvery = options.runEvery;

  SyncedCron.add({
    name: self.name,
    job: self.func,
    schedule: function(parser) {
      return self.recurrence(parser);
    }
  });

  if (options.runNow) {
    Future.task(self.func);
  }
};

DataJob.prototype.cancel = function() {
  SyncedCron.remove(this.name);
};
DataJob.prototype.recurrence = function(parser) {
  var duration = moment.duration(this.runEvery);
  if (duration.asDays() >= 1) {
    return parser.recur().every(duration.asDays()).dayOfYear();
  } else if (duration.asHours() >= 1) {
    return parser.recur().every(duration.asHours()).hour();
  } else if (duration.asMinutes() >= 1) {
    return parser.recur().every(duration.asMinutes()).minute();
  }
  return parser.recur().every(duration.asSeconds()).second();
};

DataJobs = {
  exists: function(name) {
    return !!SyncedCron.nextScheduledAtDate(name);
  }
};
