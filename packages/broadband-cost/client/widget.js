Template.BroadbandCostWidget.onCreated(function() {
  this.subscribe('broadband_cost');
});

Template.BroadbandCostWidget.helpers({
  indicatorPercent: function() { return this.indicator.value * 100; },
  indicatorValue: function() { return Math.round(this.indicator.value * 100); },
});
