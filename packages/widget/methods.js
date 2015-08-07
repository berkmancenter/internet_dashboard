Meteor.methods({
  updateWidgetPositions: function(widgetPositions) {
    if (_.isEmpty(widgetPositions)) { return; }
    var dashboard = Widgets.findOne(_.first(widgetPositions).id).dashboard();
    dashboard.authorize();
    console.log('Widget: Updating positions');

    _.each(widgetPositions, function(widget) {
      var modifier = {
        $set: {
          position: { col: widget.col, row: widget.row },
          width: widget.size_x,
          height: widget.size_y,
        }
      };
      Widgets.update(widget.id, modifier);
    });
  },
  addWidgetToDashboard: function(widget) {
    if (_.isUndefined(widget.dashboardId)) {
      throw new Meteor.Error('missing-dashboard',
          'Widget object must have dashboard id.');
    }
    var dashboard = Dashboards.findOne(widget.dashboardId);
    dashboard.authorize();

    console.log('Widget: Adding widget to dashboard ' + dashboard._id);
    Widgets.insert(widget);
  },
  removeWidgetFromDashboard: function(widgetId) {
    var dashboard = Widgets.findOne(widgetId).dashboard();
    dashboard.authorize();

    console.log('Widget: Removing ' + widgetId);
    Widgets.remove(widgetId);
  },
  updateWidgetData: function(widgetId, data) {
    var widget = Widgets.findOne(widgetId);
    if (!widget) { return; }
    var dashboard = widget.dashboard();
    dashboard.authorize();

    console.log('Widget: Updating data for ' + widgetId);
    Widgets.update(widgetId, { $set: { data: data } });
  },
  updateWidget: function(id, attrs) {
    var widget = Widgets.findOne(id);
    if (!widget) { return; }
    var dashboard = widget.dashboard();
    dashboard.authorize();

    Widgets.update(id, { $set: attrs });
  }
});
