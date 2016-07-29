Template.IMonChoroplethSettings.onCreated(function() {
  this.subscribe('imon_indicators_v2');
});

Template.IMonChoroplethSettings.helpers({
  indicator: function() {  return IMonIndicators.findOne({adminName:Template.currentData().indicatorName});},
  indicators: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.IMonChoroplethSettings.events({
  'click .save-settings': function(ev, template) {
    var indicatorName = template.find('.indicator').value;
    this.set({ 
    	indicatorName: indicatorName
    });
    template.closeSettings();
  }
});
