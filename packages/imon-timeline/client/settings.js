Template.IMonTimelineSettings.onCreated(function(){
  var template = this;
  template.autorun(function(){
    template.subscribe('imon_countries_dev');
    template.subscribe('imon_indicators_dev');
  });
});


Template.IMonTimelineSettings.helpers({
  countries: function() { return IMonCountries.find({}, { sort: { name: 1 } }); },
  indicators: function() { return IMonIndicators.find({}, { sort: { shortName: 1 } }); },
  isSelected: function(a, b) { return a == b ? 'selected' : ''; },
  isInArray: function(a, arr) { return !_.isArray(arr) || arr.indexOf(a) === -1 ? '' : 'checked'; },
  isChecked: function(a, b) { return a == b ? 'checked' : ''; },
  singleIndicator: function() { return Template.currentData().mode == 'singleIndicator' ? true : false; },
  colors: function(){ return Settings.colors; }
});

Template.IMonTimelineSettings.events({
  'click .save-settings': function(ev, template) {
    var mode = template.find('input[name="mode"]:checked').value;
    var country = mode == 'singleIndicator' ? GetChecked(template.findAll('.singleInd-countries-option:checked')) : template.find('.singleCntry-country').value;
    var ind = mode == 'singleIndicator' ? template.find('.singleInd-indicator').value : GetChecked(template.findAll('.singleCntry-indicators-option:checked'));
    var color = mode == 'singleIndicator' ? Template.currentData().color : template.find('.color').value;
    var newData = {
      mode: mode,
      indicatorName: ind,
      country: country,
      color: color
    };
    template.closeSettings();
    this.set(newData);
  },
  'change input[name="mode"]': function(ev, template){
    // Show/Hide appropriate settings based on mode selection
    var mode = $(template.find('input[name="mode"]:checked')).val();
    var div = mode === 'singleIndicator' ? { show: '.single-settings', hide: '.multi-settings' } : { hide: '.single-settings', show: '.multi-settings' };
    $(template.find(div.show)).show();
    $(template.find(div.hide)).hide();
  },
  'change .select-box-option': function(ev, template){ 
    var mode = $(template.find('input[name="mode"]:checked')).val();
    var selector = mode === 'singleIndicator' ? '.singleInd-countries-option' : '.singleCntry-indicators-option';
    var num_place = mode === 'singleIndicator' ? '.countries-select-number' : '.indicators-select-number';
    var num_selected = GetChecked(template.findAll(selector + ':checked')) == null ? 0 : GetChecked(template.findAll(selector + ':checked')).length;
    var limit = mode === 'singleIndicator' ? 10 : 5;
    $(template.find(num_place)).text(num_selected + ' SELECTED');
    if(num_selected===limit){ // reached limit 
      $(template.findAll(selector + ':not(:checked)')).prop('disabled', true);     
    }
    else if(num_selected<limit){
      $(template.findAll(selector + ':not(:checked)')).prop('disabled', false); 
    }
  },
  'click .deselect-btn': function(ev, template){
    var mode = $(template.find('input[name="mode"]:checked')).val();
    var selector = mode === 'singleIndicator' ? '.singleInd-countries-option' : '.singleCntry-indicators-option';
    $(template.findAll(selector + ':checked')).prop('checked', false);
    $(template.findAll(selector + ':not(:checked)')).prop('disabled', false);
    var num_place = mode === 'singleIndicator' ? '.countries-select-number' : '.indicators-select-number';
    $(template.find(num_place)).text('0 SELECTED');
  }
});

function GetChecked(selector){
  return $(selector).map(function(){ return $(this).val(); }).get();
}
