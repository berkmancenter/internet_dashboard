Template.PercentOnlineWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_data', Template.currentData().country.code);
  });
});

Template.PercentOnlineWidget.helpers({
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
