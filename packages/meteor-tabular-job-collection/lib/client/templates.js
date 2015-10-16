Template['TabularJobCollections.buttons'].helpers({
  failed: function () {
    return this.status === 'failed';
  },
  showCancelButton: function () {
    return ['failed', 'waiting'].indexOf(this.status) > -1;
  },
  isZombie: function () {
    return this.status === 'running' && Date.now() - this.updated > 1 * 60 * 1000;
  },
  showDeleteButton: function () {
    return ['cancelled', 'completed', 'failed', 'waiting'].indexOf(this.status) > -1;
  }
});

Template['TabularJobCollections.buttons'].events({
  'click .js-retry': function (event) {
    var data = Blaze.getData($(event.currentTarget).closest('table')[0]);
    if (!data) return;
    var collectionName = data.table.name;

    Meteor.call('TabularJobCollections.retryJob', collectionName, [this._id], function (error) {
      if (error) {
        console.log(error);
        alert(error.message);
      }
    });
  },
  'click .js-cancel': function () {
    if (!window.confirm('Really cancel?')) return;

    var data = Blaze.getData($(event.currentTarget).closest('table')[0]);
    if (!data) return;
    var collectionName = data.table.name;

    Meteor.call('TabularJobCollections.cancelJob', collectionName, [this._id], function (error) {
      if (error) {
        console.log(error);
        alert(error.message);
      }
    });
  },
  'click .js-delete': function () {
    if (!window.confirm('Really delete?')) return;

    var data = Blaze.getData($(event.currentTarget).closest('table')[0]);
    if (!data) return;
    var collectionName = data.table.name;

    Meteor.call('TabularJobCollections.deleteJob', collectionName, [this._id], function (error) {
      if (error) {
        console.log(error);
        alert(error.message);
      }
    });
  },
  'click .js-kill': function () {
    if (!window.confirm('Use this to force-fail a task that has been in the "running" state longer than it should be. Continue?')) return;

    var data = Blaze.getData($(event.currentTarget).closest('table')[0]);
    if (!data) return;
    var collectionName = data.table.name;

    Meteor.call('TabularJobCollections.killJob', collectionName, [this._id], function (error) {
      if (error) {
        console.log(error);
        alert(error.message);
      }
    });
  }
});
