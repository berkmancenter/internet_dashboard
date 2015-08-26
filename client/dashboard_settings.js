Template.DashboardsSettings.events({
  'click .save-settings': function(ev, template) {
    var attrs = {};
    attrs.publiclyEditable = template.$('#dash-public-edit').prop('checked');
    attrs.title = template.$('#dashboard-title').val();
    Meteor.call('updateDashboard', this._id, attrs);
    template.$('.dash-settings').modal('hide');
  }
});
