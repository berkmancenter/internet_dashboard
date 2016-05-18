Template.Home.onCreated(function() {
  Meteor.subscribe('seeds');
});

Template.Home.Events(function() {
	'click #template-background': function(ev, template) {
    Meteor.call('copyDashboard', dashboard._id, function(error, newId) {
      if (callback) { callback.apply(dashboard, [error, newId]); }
    });
  }
});

Template.Home.events({
  'click #template-background': function(ev, template) {
  	var templateboard = Dashboards.findOne({title: '*TEMPLATE: Country Background Information*'})
    templateboard.copy(function(error, newId) {
      if (Meteor.isClient) {
        Router.go('dashboards-show', { _id: newId });
      }
    });
  },
  'click #template-comparison': function(ev, template) {
  	var templateboard = Dashboards.findOne({title: '*TEMPLATE: Country Comparison*'})
    templateboard.copy(function(error, newId) {
      if (Meteor.isClient) {
        Router.go('dashboards-show', { _id: newId });
      }
    });
  }
});