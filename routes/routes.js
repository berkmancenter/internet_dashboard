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
  action: function() {
    this.wait(Meteor.subscribe('dashboard', this.params._id));
    this.wait(Meteor.subscribe('availableWidgets'));

    if (this.ready()) {
      var dashboard = Dashboards.findOne(this.params._id);
      var handles = dashboard.subHandles();

      var controller = this;
      Tracker.autorun(function() {
        if (_.every(handles, function(handle) { return handle.ready(); })) {
          controller.render('DashboardsShow', {
            data: function() {
              dashboard.initWidgets();
              return dashboard;
            }
          });
        }
      });
    }
  },
});
