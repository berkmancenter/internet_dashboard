Router.route('/', { name: 'home' });

Router.route('/dashboards/:_id', {
  loadingTemplate: 'Loading',

  waitOn: function () {
    return Meteor.subscribe('dashboards', this.params._id);
  },
}, {
  name: 'dashboards.show'
});

Router.route('/dashboards/new', function() {
  var newDashboard = new Dashboard();
  this.redirect('dashboards.show', { _id: newDashboard._id });
}, {
  name: 'dashboards.new'
});

