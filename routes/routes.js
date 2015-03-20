Router.route('/', { name: 'home' });

Router.route('/dashboards/new', {
  action: function() {
    Meteor.call('newDashboard', function(error, id) {
      Router.go('dashboards.show', { _id: id });
    });
  },
  name: 'dashboards.new'
});

Router.route('/dashboards/:_id', {
  name: 'dashboards.show',
  loadingTemplate: 'Loading',
  waitOn: function() {
    return [
      Meteor.subscribe('dashboard', this.params._id),
      Meteor.subscribe('availableWidgets')
    ];
  },
  data: function() {
    return Dashboards.findOne(this.params._id);
  }
});
