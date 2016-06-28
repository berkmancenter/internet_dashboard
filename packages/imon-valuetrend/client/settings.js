Template.IMonValuetrendSettings.onCreated(function(){
  var template = this;
  template.autorun(function(){
    template.subscribe('imon_countries_dev');
    template.subscribe('imon_indicators_dev');
  });
});

Template.IMonValuetrendSettings.helpers({
  countries: function() { return IMonCountriesDev.find({}, { sort: { name: 1 } }); },
  indicators: function() { return IMonIndicatorsDev.find({}, { sort: { shortName: 1 } }); },
  isSelected: function(a, b) { return a == b ? 'selected' : ''; },
  colors: function() { 
    return [
      { code: '#6192BD', name: 'Blue' },
      { code: '#2ca02c', name: 'Green' },
      { code: '#f39c12', name: 'Orange' },
      { code: '#c0392b', name: 'Red' }
    ];
  }
});

Template.IMonValuetrendSettings.events({
  'click .save-settings': function(ev, template) {
    var country = template.find('.country').value;
    var ind = template.find('.indicator').value;
    var color = template.find('.color').value;
    var newData = {
      country: country,
      indicatorName: ind,
      color: color
    };
    template.closeSettings();
    this.set(newData);
  }
});
