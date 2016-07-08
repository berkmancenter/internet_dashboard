Template.PercentOnBroadbandWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_data_v2', Template.currentData().country.code, Settings.indicatorId, true);
  });
});

Template.PercentOnBroadbandWidget.helpers({
  indicatorValue: function() {
    return this.widget.getIndicator().value.toFixed(0) + '%';
  },
  users: function() {
    var numOnline = this.widget.getIndicator().value.toFixed(0);
    return _(100).times(function(i) {
      return { online: i < numOnline ? 'online' : 'offline' };
    });
  }
});
