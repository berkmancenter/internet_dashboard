Meteor.methods({
  updateWidgetPositions: function(widgetPositions) {
    console.log('updating widget positions');
    console.log(widgetPositions);
    _.each(widgetPositions, function(widget) {
      var modifier = {
        $set: {
          position: { x: widget.row, y: widget.col },
          width: widget.size_x,
          height: widget.size_y,
        }
      };
      Widgets.update(widget.id, modifier);
    });
  },
  addWidgetToDashboard: function(widget) {
    if (_.isUndefined(widget.dashboardId)) {
      throw new Error('Widget object must have dashboard id.');
    }
    Widgets.insert(widget);
  },
  removeWidgetFromDashboard: function(widgetId) {
    console.log('removing widget: ' + widgetId);
    Widgets.remove(widgetId);
  },
  updateWidgetData: function(widgetId, data) {
    Widgets.update(widgetId, { $set: { data: data } });
  }
});
