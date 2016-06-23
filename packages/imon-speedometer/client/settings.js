Template.IMonSpeedometerSettings.onCreated(function() {
  this.subscribe('imon_countries');
  this.subscribe('imon_indicators');
});

Template.IMonSpeedometerSettings.helpers({
  countries: function() { return findAreas(false); },
  regions: function() { return findAreas(true); },
  indicators: function() { return IMonIndicators.find({ displaySuffix: 'kbps'}, { sort: { shortName: 1 } }); },
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
    var indicatorId = parseInt(template.find('.indicator').value);
    var color = template.find('.color').value;
    var newData = {
      country: countryCode,
      indicatorId: indicatorId,
      color: color
    };
    template.closeSettings();
    this.set(newData);
  }
});



function findAreas(isRegion) {
  isRegion = isRegion || false;
  return IMonCountries.find({ isRegion: isRegion }, { sort: { name: 1 } });
}
