Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', { name: 'home' });

Router.route('/dashboards/new', {
  name: 'dashboards.new',
  action: function() {
    Meteor.call('newDashboard', function(error, id) {
      Router.go('dashboards.show', { _id: id });
    });
  }
});

Router.route('/dashboards/:_id', {
  name: 'dashboards.show',
  loadingTemplate: 'Loading',
  waitOn: function() {
    return [
      Meteor.subscribe('dashboard', this.params._id),
      Meteor.subscribe('dashboardWidgets', this.params._id),
      Meteor.subscribe('activeWidgets'),
    ];
  },
  data: function() {
    return Dashboards.findOne(this.params._id);
  }
});

Router.route('/users/me', {
  name: 'users.profile',
  loadingTemplate: 'Loading',
  waitOn: function() {
    return [
      Meteor.subscribe('userData'),
    ];
  },
  data: function() {
    return Meteor.user();
  }
});

Router.route('/users/me/dashboards', {
  name: 'users.dashboards',
  loadingTemplate: 'Loading',
  waitOn: function() {
    return [
      Meteor.subscribe('userData'),
      Meteor.subscribe('userDashboards')
    ];
  },
  data: function() {
    return {
      user: Meteor.user(),
      dashboards: Dashboards.find({ ownerId: Meteor.userId() })
    };
  }
});

Router.plugin('ensureSignedIn', {
    only: ['users.profile', 'users.dashboards']
});

if (Meteor.isClient) {
  Router.plugin('bodyClasses');
}
