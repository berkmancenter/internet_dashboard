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
  },
  action: function() { 
    this.render();
  }
});

if (Meteor.isClient) {
  Router.plugin('bodyClasses');
}
