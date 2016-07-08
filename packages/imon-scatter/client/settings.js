Template.IMonScatterSettings.onCreated(function() {
  this.subscribe('imon_indicators_v2');
});

Template.IMonScatterSettings.helpers({
  indicators: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isChecked: function(val) { return val ? 'checked' : ''; },
});

Template.IMonScatterSettings.events({
  'click .save-settings': function(ev, template) {
    var newData = {
      title: template.find('#chart-title').value,
      x: {
        indicator: template.find('#x-select').value,
        log: template.find('#x-log').checked,
        jitter: parseInt(template.find('#x-jitter').value)
      },
      y: {
        indicator: template.find('#y-select').value,
        log: template.find('#y-log').checked,
        jitter: parseInt(template.find('#y-jitter').value)
      }};
    template.closeSettings();
    this.set(newData);
  }
});
