Meteor.startup(function() {
  if (Meteor.settings.admins) {
    console.log('Dashboard: Setting admins');
    var query = { username: { $in: Meteor.settings.admins } };
    var admins = Meteor.users.find(query).fetch();
    Roles.setUserRoles(admins, Roles.ADMIN);
  }
});
