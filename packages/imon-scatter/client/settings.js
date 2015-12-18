Template.IMonScatterSettings.onCreated(function() {
  this.subscribe('imon_indicators');
});

Template.IMonScatterSettings.helpers({
  indicators: function() { return IMonIndicators.find(); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.IMonScatterSettings.events({
  'click .save-settings': function(ev, template) {
    var x = template.find('#x-select').value;
    var y = template.find('#y-select').value;
    var newData = { x: { indicator: x }, y: { indicator: y }};
    template.closeSettings();
    this.set(newData);
  }
});
