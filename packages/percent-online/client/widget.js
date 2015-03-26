Template.PercentOnlineWidget.onCreated(function() {
  this.subscribe('percent_online');
});

Template.PercentOnlineWidget.helpers({
  indicatorName: function() { return Settings.indicatorName; },
  indicatorPercent: function() { return this.widget.getIndicator().value * 100; },
  indicatorValue: function() {
    return Math.round(this.widget.getIndicator().value * 100);
  },
});
