Router.route('/widgets/:_id/embed', {
  name: 'widgets-embed',
  layoutTemplate: false,
  loadingTemplate: 'EmbedLoading',
  onBeforeAction: function() {
    if (_.has(this.params.query, 'seamless')) {
      $('body').addClass('seamless');
    }
    if (_.has(this.params.query, 'unbranded')) {
      $('body').addClass('unbranded');
    }
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
