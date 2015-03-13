Template.DashboardsShow.helpers(Widgets.templateHelpers);

Template.DashboardsShow.helpers({
  widgetId: function(aspect) {
    aspect = aspect || 'widget';
    return this.fromPackage + '-' + this._id + '-' + aspect;
  },
});

Template.DashboardsShow.events({
  'click .widget-option a': function(event, template) {
    var widgetAttrs = _.pick(this, 'fromPackage', 'exports');
    var widget = new Package[this.fromPackage][this.exports].constructor(widgetAttrs);
    Meteor.call('addWidgetToDashboard', template.data._id, widget);
  }
});

Template.DashboardsShow.rendered = function() {
  $('[data-toggle="popover"]').popover()
};
