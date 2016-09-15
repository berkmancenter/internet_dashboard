Router.route('/widgets/:_id/embed', {
  name: 'widgets-embed',
  layoutTemplate: false,
  loadingTemplate: 'Loading',
  onBeforeAction: function() {
      $('body').addClass('iframebody');
      this.next();
  },
  waitOn: function() {
    return [
      Meteor.subscribe('activeWidgets'),
      Meteor.subscribe('widget', this.params._id),
      Meteor.subscribe('widgetDashboard', this.params._id)
    ];
  },
  data: function() {
    return Widgets.findOne(this.params._id);
  }
});

Router.route('/admin/jobs', {
  name: 'widgets-jobs'
});

Router.plugin('ensureSignedIn', {
    only: ['widgets-jobs']
});
