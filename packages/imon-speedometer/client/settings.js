Template.IMonSpeedometerSettings.onCreated(function() {
  this.subscribe('imon_countries_v2');
  this.subscribe('imon_indicators_v2');
});

Template.IMonSpeedometerSettings.helpers({
  countries: function() { return IMonCountries.find({}, { sort: { name: 1 } }); },
  indicators: function() { return IMonIndicators.find({ displayClass: 'speed'}, { sort: { shortName: 1 } }); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  trim: function(exp) { 
    var temp = exp.replace(/( \(kbps\))/ig, '');
    return temp.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);}); 
  },
  colors: function() { 
    return [
      { code: '#6192BD', name: 'Blue' },
      { code: '#27ae60', name: 'Green' },
      { code: '#f39c12', name: 'Orange' },
      { code: '#c0392b', name: 'Red' }
    ];
  }
});

Template.IMonSpeedometerSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var indicatorId = template.find('.indicator').value;
    var color = template.find('.color').value;
    var newData = {
      country: countryCode,
      indicatorName: indicatorId,
      color: color
    };
    template.closeSettings();
    this.set(newData);
  }
});


