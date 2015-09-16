Template.UsersDashboards.helpers({
  dashParams: function() { return { _id: this._id }; },
  title: function() {
    return this.getTitle();
  }
});
Template.UsersDashboards.onRendered(function() {
  var template = this;
  template.$('.delete-dash').confirmation({
    onConfirm: function(ev, $target) {
      var dashId = $target.data('did');
      Meteor.call('deleteDashboard', dashId);
    }
  });
});
