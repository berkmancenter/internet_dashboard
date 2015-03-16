Template.WidgetShow.helpers(Widgets.templateHelpers);
Template.WidgetShow.events(Widgets.templateEvents);

Template.WidgetShow.helpers({
  widgetId: function(aspect) {
    aspect = aspect || 'widget';
    return this.fromPackage + '-' + this._id + '-' + aspect;
  },
});

Template.DashboardsShow.events({
  'click a.add-widget': function(ev, template) {
    var exported = Widgets.packageExports(this),
        widgetAttrs = _.pick(this, 'fromPackage', 'exports');

    var dashboard = Widgets.dashboardData(template);

    var subHandles = _.map(exported.requiredPublications(widgetAttrs.data), function(pub) {
      console.log(pub);

      return Meteor.subscribe(pub, widgetAttrs.data);
    });

    Tracker.autorun(function(comp) {
      var allReady = _.every(subHandles, function(sub) { return sub.ready(); });
      if (allReady) {
        var widget = Widgets.construct(widgetAttrs, dashboard);
        $('.add-widget-modal').modal('hide');
        Meteor.call('addWidgetToDashboard', template.data._id, widget.toJSON());
        comp.stop();
      }
    });
  }
});

Template.DashboardsShow.rendered = function() {
  var popoverSelector = '[data-toggle="popover"]';
  $('body').popover({
    selector: popoverSelector,
    content: function() { return $('.for-' + this.id).removeClass('hidden').get(0); }
  });
  // We've got to do some tricky stuff here so we can reuse the same node
  $('body').on('hide.bs.popover', popoverSelector, function(ev) {
    var $node = $('.for-' + this.id);
    // Wait for hidden so it doesn't disappear and look weird
    $(this).on('hidden.bs.popover', function() {
      $(this).after($node.addClass('hidden'));
    });
  });
};
