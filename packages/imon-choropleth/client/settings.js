
Template.IMonChoroplethSettings.defaultIndicator = {name:'Percentage of households with Internet',_id: 'Percentage of households with Internet'};

Template.IMonChoroplethSettings.onCreated(function() {
  this.subscribe('imon_indicators');
});

Template.IMonChoroplethSettings.helpers({
  indicators: function() { return IMonIndicators.find({}, { sort: { name: 1 }}); },
  currentIndicator: function() { return currentIndicator() },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.IMonChoroplethSettings.events({
  'click .save-settings': function(ev, template) {
    var indicator = {
      id: template.find('.indicator').value,
      name: template.find('.indicator').selectedOptions[0].innerText.trim()
    };
    var newData = { indicator: indicator };
    this.set(newData);
    template.closeSettings();
    console.log("REINOS: Settings changed!");
    //Template.IMonChoroplethWidget.updateSubscription();
  }
});
