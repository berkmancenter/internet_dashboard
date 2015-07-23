var authorize = function(dashboard) {
  if (!dashboard.editableBy(Meteor.user())) {
    throw new Meteor.Error('not-owner',
        'Must be the current owner of the dashboard to edit.');
  }
};

Meteor.methods({
  updateWidgetPositions: function(widgetPositions) {
    var dashboard = Widgets.findOne(_.first(widgetPositions).id).dashboard();
    authorize(dashboard);
    console.log('Widget: Updating positions');

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
      throw new Meteor.Error('missing-dashboard',
          'Widget object must have dashboard id.');
    }
    var dashboard = Dashboards.findOne(widget.dashboardId);
    authorize(dashboard);

    Widgets.insert(widget);
  },
  removeWidgetFromDashboard: function(widgetId) {
    var dashboard = Widgets.findOne(widgetId).dashboard();
    authorize(dashboard);

    console.log('Widget: Removing ' + widgetId);
    Widgets.remove(widgetId);
  },
  updateWidgetData: function(widgetId, data) {
    var dashboard = Widgets.findOne(widgetId).dashboard();
    authorize(dashboard);

    console.log('Widget: Updating data for ' + widgetId);
    Widgets.update(widgetId, { $set: { data: data } });
  }
});
