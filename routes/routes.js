// From https://github.com/iron-meteor/iron-router/issues/1189
RouteController.prototype.redirect = function (routeOrPath, params, options) {
    options = options || {};
    if (!options.hasOwnProperty("replaceState")) {
        options.replaceState = true;
    }
    return this.router.go(routeOrPath, params, options);
};

Router.configure({
  layoutTemplate: 'ApplicationLayout',
  title: 'Internet Monitor Dashboard'
});

Router.route('/', {
  name: 'home',
  title: 'Home | Internet Monitor Dashboard'
});

Router.route('/dashboards/new', {
  name: 'dashboards-new',
  action: function() {
    // We don't want the new dashboard URL to show up in history
    var router = this;
    Meteor.call('newDashboard', function(error, id) {
      router.redirect('dashboards-show', { _id: id });
    });
  }
});

Router.route('/dashboards/:_id', {
  name: 'dashboards-show',
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
  },
  title: function() {
    if (this.data()) {
      return this.data().getTitle() + ' | Internet Monitor Dashboard';
    }
    return 'Dashboard | Internet Monitor Dashboard';
  }
});

Router.route('/users/me', {
  name: 'users-profile',
  loadingTemplate: 'Loading',
  waitOn: function() {
    return [
      Meteor.subscribe('userData'),
    ];
  },
  data: function() {
    return { user: Meteor.user() };
  },
  title: 'My Profile | Internet Monitor Dashboard'
});

Router.route('/users/me/dashboards', {
  name: 'users-dashboards',
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
  },
  title: 'My Dashboards | Internet Monitor Dashboard'
});

Router.route('/admin/metrics', {
  name: 'admin-metrics',
  loadingTemplate: 'Loading',
  waitOn: function() {
    return [
      Meteor.subscribe('metrics'),
      Meteor.subscribe('widgetCounts'),
    ];
  },
  data: function() {
    var metrics = Metrics.findOne() || {};
    return _.extend(metrics, {
      widgetCounts: WidgetCounts.find({}, { sort: { numInstances: -1 }}).fetch()
    });
  }
});

Router.plugin('ensureSignedIn', {
    only: ['users-profile', 'users-dashboards', 'admin-metrics']
});
