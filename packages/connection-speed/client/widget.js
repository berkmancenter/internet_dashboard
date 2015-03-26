Template.ConnectionSpeedWidget.onCreated(function() {
  this.subscribe('connection_speed');
});

Template.ConnectionSpeedWidget.helpers({
  indicatorName: function() { return Settings.indicatorName; },
  indicatorPercent: function() { return this.widget.getIndicator().value * 100; },
  indicatorValue: function() {
    return Math.round(this.widget.getIndicator().value * 100);
  },
});
