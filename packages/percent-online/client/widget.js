Template.PercentOnlineWidget.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.PercentOnlineWidget.helpers({
  ready: function() {
    return Template.instance().subscriptionsReady() && !this.isEmpty();
  },
  indicatorName: function() { return Settings.indicatorName; },
  indicatorPercent: function() { return this.widget.getIndicator().percent * 100; },
  indicatorValue: function() { return this.widget.getIndicator().value; },
  users: function() {
    var numOnline = parseInt(this.widget.getIndicator().value, 10);
    return _(100).times(function(i) {
      return { online: i < numOnline ? 'online' : 'offline' };
    });
  }
});
