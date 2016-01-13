Template.Header.helpers({
  notHome: function() {
    return Router.current() &&
      Router.current().route.getName() !== 'home';
  },
  onDashboard: function() {
    return Router.current() &&
      Router.current().route.getName() === 'dashboards-show';
  }
});
Template.Header.events({
  'click #sign-out': function() { Meteor.logout() },
  'click #copy-dashboard': function(ev, template) {
    this.copy(function(error, newId) {
      if (Meteor.isClient) {
        Router.go('dashboards-show', { _id: newId });
      }
    });
  },
  'click #template-background': function(ev, template) {
    Meteor.call('copyDashboard', 'YdpnELWZEwR6iJsLu', function(error, newId) {
      if (callback) { callback.apply(dashboard, [error, newId]); }
    });
  }
});
