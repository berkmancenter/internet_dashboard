Meteor.methods({
  //FIXME
  updateWidgetPositions: function(dashboardId, widgetPositions) {
    return true;
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
  }
});
