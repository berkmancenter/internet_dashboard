Meteor.methods({
  newDashboard: function() {
    return Dashboards.insert(new Dashboard());
  },
  addWidgetToDashboard: function(dashboardId, widget) {
    Dashboards.update(dashboardId, { $push: { widgets: widget } });
  },
  removeWidgetFromDashboard: function(dashboardId, widgetId) {
    Dashboards.update(dashboardId, { $pull: { widgets: { _id: widgetId } } });
  },
  updateDashboardWidgetData: function(dashboardId, widgetId, data) {
    Dashboards.update(
      { _id: dashboardId, 'widgets._id': widgetId },
      { $set: { 'widgets.$.data': data } }
    );
  },
  updateDashboardWidgetPositions: function(dashboardId, widgetPositions) {
    _.each(widgetPositions, function(widget) {
      var query = { _id: dashboardId, 'widgets._id': widget.id };
      var modifier = {
        $set: {
          'widgets.$.position': { x: widget.row, y: widget.col },
          'widgets.$.width': widget.size_x,
          'widgets.$.height': widget.size_y,
        }
      };
      Dashboards.update(query, modifier);
    });
  },
});

