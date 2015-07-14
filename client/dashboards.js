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

Template.DashboardsAdd.helpers({
  availableWidgets: function() {
    return WidgetTypes.find();
  }
});

Template.DashboardsShow.events({
  'click a.add-widget': function(ev, template) {
    var dashboard = Dashboards.dataFromChild(template);
    var dashboardTemplate = Dashboards.templateFromChild(template);
    var widgetAttrs = _.pick(this, 'packageName', 'exportedVar');
    widgetAttrs.typeId = this._id;

    var widget = Widget.construct(widgetAttrs);
    dashboard.addWidget(widget);
    $('.add-widget-modal').modal('hide');
  }
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

Template.DashboardsShow.onCreated(function() {
  this.widgetNodes = [];
});

Template.DashboardsShow.onRendered(function() {
  var self = this;
  var dash = self.data;
  var popoverSelector = '[data-toggle="popover"]';

  _.each(self.dashHandles, function(handles, widgetId) {
    renderWidget(self, widgetId, handles);
  });

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

  self.gridster = self.$('#widgets').gridster({
    widget_selector: self.widgetNodes,
    widget_margins: [dash.gutter / 2, dash.gutter / 2],
    widget_base_dimensions: [dash.columnWidth, dash.rowHeight],
    serialize_params: serializePositions,
    autogrow_cols: true,
    resize: {
      enabled: true,
      resize: dash.onWidgetResize.bind(dash)
    },
    draggable: {
      handle: '.title-bar',
      stop: function() { Widgets.updatePositions(self.gridster.serialize()); }
    }
  }).data('gridster');

  //Widgets.updatePositions(self.gridster.serialize());

});
