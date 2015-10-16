/* global TabularJobCollections:false */
/* global Job:false - from vsivsi:job-collection */

// Package users can override this to authenticate these methods
TabularJobCollections.authenticateMethods = function () {
  return true;
};

var authenticateMethod = function (func) {
  return function () {
    if (TabularJobCollections.authenticateMethods(this.userId)) {
      return func.apply(this, arguments);
    }
    throw new Meteor.Error(401, 'Unauthorized');
  };
};

var getJobCollection = function (name) {
  return TabularJobCollections._tables[name].collection;
};

Meteor.methods({
  'TabularJobCollections.retryJob': authenticateMethod(function (name, ids) {
    check(name, String);
    check(ids, [String]);
    return getJobCollection(name).restartJobs(ids);
  }),
  'TabularJobCollections.cancelJob': authenticateMethod(function (name, ids) {
    check(name, String);
    check(ids, [String]);
    return getJobCollection(name).cancelJobs(ids);
  }),
  'TabularJobCollections.deleteJob': authenticateMethod(function (name, ids) {
    check(name, String);
    check(ids, [String]);
    return getJobCollection(name).removeJobs(ids);
  }),
  'TabularJobCollections.killJob': authenticateMethod(function (name, ids) {
    check(name, String);
    check(ids, [String]);

    var userId = Meteor.userId();

    // Auto-fail each zombie task
    var collection = getJobCollection(name);
    ids.forEach(function (id) {
      var job = collection.findOne({_id: id, status: 'running'});
      new Job(collection, job).fail('Zombie process killed by user ' + userId);
    });
  })
});
