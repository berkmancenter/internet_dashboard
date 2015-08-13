Template.Header.helpers({
  onDashboard: function() {
    return Router.current() &&
      Router.current().route.getName() === 'dashboards.show';
  }
});
Template.Header.events({
  'click #sign-out': function() { Meteor.logout() }
});
