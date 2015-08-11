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
  self.closeAllPopovers = function() {
    self.data.widgets().forEach(function(widget) {
      Template.WidgetShow.closePopover(widget, 'Settings');
      Template.WidgetShow.closePopover(widget, 'Info');
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
});

Template.DashboardsSettings.events({
  'click .save-settings': function(ev, template) {
    var attrs = {};
    attrs.publiclyEditable = template.$('#dash-public-edit').prop('checked');
    Meteor.call('updateDashboard', this._id, attrs);
    template.$('.dash-settings').modal('hide');
  }
});
