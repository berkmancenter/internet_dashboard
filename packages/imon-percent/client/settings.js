Template.IMonPercentSettings.onCreated(function() {
  this.subscribe('imon_countries');
  this.subscribe('imon_indicators');
});


Template.IMonPercentSettings.helpers({
  countries: function() { return IMonCountries.find({ isRegion: false }, { sort: { name: 1 } }); },
  regions: function() { return IMonCountries.find({ isRegion: true }, { sort: { name: 1 } }); },
  indicators: function() { return IMonIndicators.find({ displaySuffix: '%', max: { $lte: 100 } }, { sort: { shortName: 1 } }); },
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
    var ind = parseInt(template.find('.indicator-select').value);
    var available = IMonCountries.findOne({ code: country }).dataSources.indexOf(ind) === -1 ? false : true;
    if(available){
      $('#percent-error-message').remove();
      var newData = {
      country: country,
      indicatorId: ind,
      color: template.find('.color-select').value
      };
      template.closeSettings();
      this.set(newData);
    }
    else if(!available){
      var missingCountry = IMonCountries.findOne({ code: country }).name;
      var missingInd = IMonIndicators.findOne({ id: ind }).shortName;
      var message = '<strong><i class="fa fa-exclamation-triangle"></i></strong> No '+ missingInd +' data found for ' + missingCountry;
      var error = template.find('.percent-error');
      $(error).html('<div class="alert alert-warning" id="percent-error-message" style="position:inherit;box-shadow:none;">'
        +'<a href="#" class="close" style="position:inherit;" data-dismiss="alert" aria-label="close">&times;</a>'
        + message
        +'</div>');
     }
  }
});




