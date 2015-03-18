Template.WidgetShow.helpers(Widgets.templateHelpers);

Template.WidgetShow.helpers({
  widgetId: function(aspect) {
    aspect = aspect || 'widget';
    return this.fromPackage + '-' + this._id + '-' + aspect;
  },
  widgetClass: function() {
    return this.fromPackage;
  },
});

Template.DashboardsShow.helpers({
  test: function() {
    console.log('rendered dash');
  }
});

Template.DashboardsShow.events({
  'click a.add-widget': function(ev, template) {
    var exported = Widgets.packageExports(this),
        widgetAttrs = _.pick(this, 'fromPackage', 'exports');

    var dashboard = Widgets.dashboardData(template);

    var subHandles = _.map(exported.requiredPublications(), function(pub) {
      return Meteor.subscribe(pub);
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

Template.DashboardsShow.created = function() {
  this.widgetNodes = [];
};

var nodeIdToWidgetId = function(nodeId) {
  var matches = nodeId.match(/^.+-([0-9a-zA-Z]{17})-.+$/);
  return matches[1] || null;
};

var serializePositions = function($widget, position) {
  position.id = nodeIdToWidgetId($widget.attr('id'));
  return _.pick(position, ['col', 'row', 'size_x', 'size_y', 'id']);
};

var updateWidgetPositions = function(dashboardTemplate) {
  Meteor.call(
    'updateDashboardWidgetPositions',
    dashboardTemplate.data._id,
    dashboardTemplate.gridster.serialize()
  );
};

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

  var dashboardTemplate = this;
  this.gridster = $('#dashboard > ul').gridster({
    widget_selector: this.widgetNodes,
    widget_margins: [10, 10],
    widget_base_dimensions: [150, 150],
    serialize_params: serializePositions,
    draggable: {
      stop: function() { updateWidgetPositions(dashboardTemplate); }
    }
  }).data('gridster');
};

Template.WidgetShow.rendered = function() {
  var widgetNode = this.firstNode;
  var widgetData = $(widgetNode).data();
  var dashboardTemplate = Widgets.dashboardTemplate(this);

  dashboardTemplate.widgetNodes.push(widgetNode);

  if (dashboardTemplate.gridster) {
    dashboardTemplate.gridster.add_widget(
      widgetNode, widgetData.sizex, widgetData.sizey
    );
    updateWidgetPositions(dashboardTemplate);
  }
};

Template.WidgetShow.events({
  'click .remove-widget': function(ev, template) {
    var dashboardTemplate = Widgets.dashboardTemplate(template);
    dashboardTemplate.gridster.remove_widget(template.firstNode);
    updateWidgetPositions(dashboardTemplate);
  }
});

Template.WidgetShow.events(Widgets.templateEvents);
