Template.DashboardsShow.helpers({
  test: function() {
    console.log('rendered dash');
  }
});

Template.DashboardsShow.events({
  'click a.add-widget': function(ev, template) {
    var dashboard = Widgets.dashboardData(template);
    var widgetAttrs = _.pick(this, 'fromPackage', 'exports');
    var subHandles = Widgets.subHandles(widgetAttrs);

    Tracker.autorun(function(comp) {
      if (Utils.Subs.allReady(subHandles)) {
        // FIXME I feel like this can be cleaned up.
        var widget = Widgets.construct(widgetAttrs, dashboard);
        dashboard.addWidget(widget);
        $('.add-widget-modal').modal('hide');
        comp.stop();
      }
    });
  }
});

Template.DashboardsShow.onCreated(function() {
  var self = this;
  var dash = self.data;
  self.widgetNodes = [];
  self.dashHandles = dash.subAndInitWidgets();
});

// FIXME Move this or make it a data attr
var nodeIdToWidgetId = function(nodeId) {
  var matches = nodeId.match(/^.+-([0-9a-zA-Z]{17})-.+$/);
  return matches[1] || null;
};

var serializePositions = function($widget, position) {
  position.id = nodeIdToWidgetId($widget.attr('id'));
  return _.pick(position, ['col', 'row', 'size_x', 'size_y', 'id']);
};

Template.DashboardsShow.onRendered(function() {
  var self = this;
  var dash = self.data;
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

  _.each(self.dashHandles, function(handles, widgetId) {
    self.autorun(function(comp) {
      if (Utils.Subs.allReady(handles)) {
        var widget = dash.widgetById(widgetId);
        widget.data = _.omit(widget.data, ['widget', '_dashboard']);
        if (!widget.rendered) {
          Blaze.renderWithData(
            Template.WidgetShow,
            widget,
            self.find('#widgets'),
            undefined,
            self.view
          );
          widget.rendered = true;
          comp.stop();
        }
      }
    });
  });

  self.gridster = $('#dashboard > ul').gridster({
    widget_selector: self.widgetNodes,
    widget_margins: [dash.gutter / 2, dash.gutter / 2],
    widget_base_dimensions: [dash.columnWidth, dash.rowHeight],
    serialize_params: serializePositions,
    draggable: {
      stop: function() { Widgets.updatePositions(dash, self.gridster.serialze()); }
    }
  }).data('gridster');
});
