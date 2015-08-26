Template.DashboardsShow.helpers({
  test: function() {
    console.log('rendered dash');
  },
  widgets: function() {
    return Widgets.find();
  },
  noWidgets: function() {
    return Widgets.find().count() === 0;
  }
});

Template.DashboardsShow.events({
  'widget:rendered': function(ev, dashTemplate, widgetTemplate) {
    var widgetNode = widgetTemplate.firstNode;
    if (dashTemplate.gridster) {
      dashTemplate.gridster.add_widget(
          widgetNode, $(widgetNode).data('sizex'), $(widgetNode).data('sizey'));
      Widgets.updatePositions(dashTemplate.gridster.serialize());
    } else {
      dashTemplate.widgetNodes.push(widgetNode);
    }
  },
  'widget:destroyed': function(ev, dashTemplate, widgetTemplate) {
    if (dashTemplate.gridster) {
      dashTemplate.gridster.remove_widget(ev.target, function() {
        Widgets.updatePositions(dashTemplate.gridster.serialize());
      });
    }
  },
  'mousedown': function(ev, template) {
    // Popovers are inserted as children of body, so clicks on them never pass
    // to this template. Therefore, any click on this template that isn't
    // supposed to open a popover can safely close all popovers.
    if ($(ev.target).closest('*[data-toggle="popover"]').length === 0) {
      template.closeAllPopovers();
    }
  },
  'show.bs.popover': function(ev, template) {
    var type = $(ev.target).attr('class').match(/\bbutton-(\w+)\b/)[1];
    type = s.capitalize(type);
    var except = [this, type];
    template.closeAllPopovers(except);
  }
});

// FIXME Move this or make it a data attr
var nodeIdToWidgetId = function(nodeId) {
  var matches = nodeId.match(/^.+-([0-9a-zA-Z]{17})-.+$/);
  return matches[1] || null;
};

var serializePositions = function($widget, position) {
  if (!position) { return; } // In case the widget doesn't exist yet
  position.id = nodeIdToWidgetId($widget.attr('id'));
  return _.pick(position, ['col', 'row', 'size_x', 'size_y', 'id']);
};

Template.DashboardsShow.onCreated(function() {
  var self = this;
  self.widgetNodes = [];
  self.onWidgetResize = {
    start: function(ev, ui, $widget) {
      $widget.trigger('gridster:resizestart', ev, ui);
    },
    stop: function(ev, ui, $widget) {
      $widget.trigger('gridster:resizestop', ev, ui);
      Widgets.updatePositions(self.gridster.serialize());
    }
  };
  self.onWidgetDrag = {
    start: function(ev, ui) {
      self.closeAllPopovers();
    },
    stop: function(ev, ui) {
      Widgets.updatePositions(self.gridster.serialize());
    }
  };
  self.closeAllPopovers = function(except) {
    var types = ['Settings', 'Info'];

    self.data.widgets().forEach(function(widget) {
      _.each(types, function(type) {
        if (except && _.isEqual(except, [widget, type])) { return; }
        Template.WidgetShow.closePopover(widget, type);
      });
    });
  };
});

Template.DashboardsShow.onRendered(function() {
  var self = this;
  var dash = self.data;

  self.gridster = self.$('#widgets').gridster({
    widget_selector: self.widgetNodes,
    widget_margins: [dash.gutter / 2, dash.gutter / 2],
    widget_base_dimensions: [dash.columnWidth, dash.rowHeight],
    serialize_params: serializePositions,
    autogrow_cols: true,
    resize: {
      enabled: true,
      start: self.onWidgetResize.start,
      stop: self.onWidgetResize.stop
    },
    draggable: {
      handle: '.title-bar',
      start: self.onWidgetDrag.start,
      stop: self.onWidgetDrag.stop
    }
  }).data('gridster');

  // Keep gridster up to date when other clients resize
  Widgets.find({ dashboardId: dash._id }).observeChanges({
    changed: function(id, fields) {
      var widget = Widgets.findOne(id);
      if (_(fields).has('width') || _(fields).has('height')) {
        var $widgetNode = self.$('#' + widget.componentId());
        self.gridster.resize_widget(
            $widgetNode, fields.width, fields.height, false);
      }
    }
  });
});
