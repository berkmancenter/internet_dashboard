Template.IMonSpeedometerSettings.onCreated(function() {
  this.subscribe('imon_countries_v2');
  this.subscribe('imon_indicators_v2');
});

Template.IMonSpeedometerSettings.onRendered(function(){
  var template = this;
  var id = Template.instance().data.widget._id;
  // Logic here is only for single mode
  // 1. Initially fill the years
  var indicator = Template.currentData().indicatorName;
  Meteor.call('getIndicatorYears', indicator, function(error, result){
    Session.set(id+'-years', result);
  });
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
  },
  year: function(){ var id = Template.instance().data.widget._id; return Session.get(id+'-years'); }
});

Template.IMonSpeedometerSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var indicatorId = template.find('.indicator').value;
    var color = template.find('.color').value;
    var year = template.find('#year-select-single').value;
    var byYear = !(year === 'none');
    var chosenYear = year === 'none' ? '' : parseInt(year);
    var newData = {
      byYear: byYear,
      chosenYear: chosenYear,
      country: countryCode,
      indicatorName: indicatorId,
      color: color
    };
    template.closeSettings();
    this.set(newData);
  },
  'change .indicator': function(ev, template){
    var id = Template.instance().data.widget._id;
    var indicator = template.find('.indicator').value;
    toggle(template.find('#year-select-single'), true);
    Meteor.call('getIndicatorYears', indicator, function(error, result){
      toggle(template.find('#year-select-single'), false);
      Session.set(id+'-years', result);
    });
  }
});

function toggle(selector, isDisabled){
  $(selector).prop('disabled', isDisabled);
}


