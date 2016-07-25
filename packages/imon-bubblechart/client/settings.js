Template.IMonBubbleChartSettings.onCreated(function() {
  this.subscribe('imon_indicators_v2');
});

Template.IMonBubbleChartSettings.helpers({
  indicators: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isChecked: function(val) { return val ? 'checked' : ''; },
  isBubbleSize: function(a,b){ return a === 'none' && b.same ? 'selected' : a === b.indicator ? 'selected' : ''; }
});

Template.IMonBubbleChartSettings.events({
  'click .save-settings': function(ev, template) {
    var isSameSize = template.find('#z-select').value === 'none' ? true : false;
    var newData = {
      title: template.find('#chart-title').value,
      z: {
        same: isSameSize,
        indicator: isSameSize ? '' : template.find('#z-select').value
      },
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
