Template.IMonScatterSettings.onCreated(function() {
  this.subscribe('imon_indicators');
});

Template.IMonScatterSettings.helpers({
  indicators: function() { return IMonIndicators.find(); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isChecked: function(val) { return val ? 'checked' : ''; },
});

Template.IMonScatterSettings.events({
  'click .save-settings': function(ev, template) {
    var newData = {
      title: template.find('#chart-title').value,
      x: {
        indicator: template.find('#x-select').value,
        log: template.find('#x-log').checked
      },
      y: {
        indicator: template.find('#y-select').value,
        log: template.find('#y-log').checked
      }};
    template.closeSettings();
    this.set(newData);
  }
});
