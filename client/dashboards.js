Template.WidgetShow.helpers(Widgets.templateHelpers);
Template.WidgetShow.events(Widgets.templateEvents);

Template.WidgetShow.helpers({
  widgetId: function(aspect) {
    aspect = aspect || 'widget';
    return this.fromPackage + '-' + this._id + '-' + aspect;
  },
});

Template.DashboardsShow.events({
  'click a.add-widget': function(event, template) {
    var exported = Widgets.packageExports(this),
        widgetAttrs = _.pick(this, 'fromPackage', 'exports');

    var subHandles = _.map(exported.requiredPublications(widgetAttrs.data), function(pub) {
      return Meteor.subscribe(pub);
    });

    Tracker.autorun(function(comp) {
      var allReady = _.every(subHandles, function(sub) { return sub.ready(); });
      if (allReady) {
        var widget = Widgets.construct(widgetAttrs);
        $('.add-widget-modal').modal('hide');
        Meteor.call('addWidgetToDashboard', template.data._id, widget);
        comp.stop();
      }
    });
  }
});

Template.DashboardsShow.rendered = function() {
  $('body').popover({
    selector: '[data-toggle="popover"]',
    content: function() { return $('.my-popover-content.for-' + this.id).html(); }
  });
};
