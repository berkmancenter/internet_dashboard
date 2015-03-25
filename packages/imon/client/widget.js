Template.IMonWidget.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.IMonWidget.helpers({
  indicatorPercent: function() { return this.indicator.value * 100; },
  indicatorValue: function() { return Math.round(this.indicator.value * 100); },
});
