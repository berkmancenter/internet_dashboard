Template.Header.helpers({
  notHome: function() {
    return Router.current() &&
      Router.current().route.getName() !== 'home';
  }
});
Template.Header.events({
  'click #sign-out': function() { Meteor.logout() }
});
