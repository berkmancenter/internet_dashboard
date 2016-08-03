Template.IMonPercentSettings.onCreated(function() {
  this.subscribe('imon_countries_v2');
  this.subscribe('imon_indicators_v2');
});

Template.IMonPercentSettings.onRendered(function(){
  var template = this;
  var id = Template.instance().data.widget._id;
  // Logic here is only for single mode
  // 1. Initially fill the years
  var indicator = Template.currentData().indicatorName;
  Meteor.call('getIndicatorYears', indicator, function(error, result){
    Session.set(id+'-years', result);
  });
});


Template.IMonPercentSettings.helpers({
  countries: function() { return IMonCountries.find({}, { sort: { name: 1 } }); },
  year: function(){ var id = Template.instance().data.widget._id; return Session.get(id+'-years'); },
  indicators: function() { return IMonIndicators.find({ displayClass: 'percentage', max: { $lte: 100 } }, { sort: { shortName: 1 } }); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isChecked: function(a, b) { return a === b ? 'checked' : ''; },
  removePerc: function(a) { return a.replace(' (%)', ''); },
  colors: function() { 
    return [
      { code: '#6192BD', name: 'Blue' },
      { code: '#27ae60', name: 'Green' },
      { code: '#f39c12', name: 'Orange' },
      { code: '#c0392b', name: 'Red' }
    ];
  }
});


Template.IMonPercentSettings.events({
  'click .save-settings': function(ev, template) {
    var country = template.find('.country-select').value;
    var ind = template.find('.indicator-select').value;
    var year = template.find('#year-select-single').value;
    var byYear = !(year === 'none');
    var chosenYear = year === 'none' ? '' : parseInt(year);
    var available = IMonCountries.findOne({ code: country }).dataSources.indexOf(ind) === -1 ? false : true;
    if(available){
      $('#percent-error-message').remove();
      var newData = {
      country: country,
      indicatorName: ind,
      byYear: byYear,
      chosenYear: chosenYear,
      color: template.find('.color-select').value
      };
      template.closeSettings();
      this.set(newData);
    }
    else if(!available){
      var missingCountry = IMonCountries.findOne({ code: country }).name;
      var missingInd = IMonIndicators.findOne({ adminName: ind }).shortName;
      var message = '<strong><i class="fa fa-exclamation-triangle"></i></strong> No '+ missingInd +' data found for ' + missingCountry;
      var error = template.find('.percent-error');
      $(error).html('<div class="alert alert-warning" id="percent-error-message" style="position:inherit;box-shadow:none;">'
        +'<a href="#" class="close" style="position:inherit;" data-dismiss="alert" aria-label="close">&times;</a>'
        + message
        +'</div>');
     }
  },
  'change .indicator-select':function(ev, template){
    var id = Template.instance().data.widget._id;
    var indicator = template.find('.indicator-select').value;
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


