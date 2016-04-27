

function setNewIndicatorId(widgetData,indicatorId){
  console.log("REINOS: widgetData", widgetData);
  var newData = { newIndicatorId: indicatorId };
  widgetData.set(newData);
};

function currentIndicatorId(){
  var widgetData = Template.IMonChoroplethSettings.currentData();
  if (widgetData.newIndicatorId ){
    return widgetData.newIndicatorId;
  } else if ( widgetData.indicatorId){
    return widgetData.indicatorId;
  } else {
    return Template.IMonChoroplethSettings.defaultIndicatorId;
  }
}

Template.IMonChoroplethSettings.defaultIndicatorId = 6;

Template.IMonChoroplethSettings.onCreated(function() {
  this.subscribe('imon_indicators');
});

Template.IMonChoroplethSettings.helpers({
  indicator: function() {  return IMonIndicators.findOne({id:currentIndicatorId()});},
  indicators: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.IMonChoroplethSettings.events({
  'click .save-settings': function(ev, template) {
    var indicatorId  = template.find('.indicator').value;
    console.log("REINOS: indicatorId: " , indicatorId);
    setNewIndicatorId(this,indicatorId);
    template.closeSettings();
  }
});
