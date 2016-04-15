

function setIndicator(widgetData,indicator){
  console.log("REINOS:", widgetData);
  var newData = { indicator: indicator };
    widgetData.set(newData);
};

Template.IMonChoroplethSettings.defaultIndicator ={ "id" : 6, "name" : "Percentage of households with Internet", "shortName" : "Percentage of households with Internet", "sourceName" : "ITU", "min" : 1.34822, "max" : 97.4 };

//{name:'Percentage of households with Internet',_id: 'Percentage of households with Internet'};

Template.IMonChoroplethSettings.onCreated(function() {
  this.subscribe('imon_indicators');
  this.autorun(function() {
    //setIndicator(this,Template.IMonChoroplethSettings.defaultIndicator);
  });
});

Template.IMonChoroplethSettings.helpers({
  indicators: function() { return IMonIndicators.find({}, { sort: { name: 1 }}); },
  currentIndicator: function() { return currentIndicator() },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.IMonChoroplethSettings.events({
  'click .save-settings': function(ev, template) {
    var indicatorName  = template.find('.indicator').value;
    setIndicator(this,IMonIndicators.findOne({name:indicatorName}));
    template.closeSettings();
  }
});
