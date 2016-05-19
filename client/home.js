Template.Home.onCreated(function() {
  Meteor.subscribe('seeds');
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