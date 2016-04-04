
Template.ImonChoroplethSettings.defaultIndicator = {name:'Percentage of households with Internet',_id: 'Percentage of households with Internet'};

Template.ImonChoroplethSettings.onCreated(function() {
  //template.set({'indicator':{name:'Percentage of households with Internet'}});
  this.subscribe('imon_indicators');
});

Template.ImonChoroplethSettings.helpers({
  indicators: function() { return IMonIndicators.find({}, { sort: { name: 1 }}); },
  currentIndicator: function() { return currentIndicator() },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.ImonChoroplethSettings.events({
  'click .save-settings': function(ev, template) {
    var indicator = {
      id: template.find('.indicator').value,
      name: template.find('.indicator').selectedOptions[0].innerText.trim()
    };
    var newData = { indicator: indicator };
    this.set(newData);
    template.closeSettings();
    console.log("REINOS: Settings changed!");
    //Template.ImonChoroplethWidget.updateSubscription();
  }
});
