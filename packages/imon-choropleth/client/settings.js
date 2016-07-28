Template.IMonChoroplethSettings.onCreated(function() {
  this.subscribe('imon_indicators_v2');
});

Template.IMonChoroplethSettings.helpers({
  indicator: function() {  return IMonIndicators.findOne({adminName:Template.currentData().indicatorName});},
  indicators: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isAnimated: function(){ return Template.currentData().animate ? 'checked' : ''; }
});

Template.IMonChoroplethSettings.events({
  'click .save-settings': function(ev, template) {
    var indicatorName = template.find('.indicator').value;
    this.set({ 
    	indicatorName: indicatorName,
    	animate: template.find('#animate').checked
    });
    template.closeSettings();
  }
});
