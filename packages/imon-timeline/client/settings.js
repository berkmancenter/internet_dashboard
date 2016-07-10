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
  isInArray: function(a, arr) { return arr.indexOf(a) === -1 ? '' : 'checked'; },
  isChecked: function(a, b) { return a == b ? 'checked' : ''; },
  singleIndicator: function() { return Template.currentData().mode == 'singleIndicator' ? true : false; }
});

Template.IMonTimelineSettings.events({
  'click .save-settings': function(ev, template) {
    var mode = template.find('input[name="mode"]:checked').value;
    var country = mode == 'singleIndicator' ? GetChecked(template.findAll('.singleInd-countries-option:checked')) : 'usa'; // temp
    var ind = mode == 'singleIndicator' ? template.find('.singleInd-indicator').value : ['bbrate', 'hhnet']; // temp
    var newData = {
      indicatorName: ind,
      country: country
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
  'change .singleInd-countries-option': function(ev, template){ 
    var num_selected = GetChecked(template.findAll('.singleInd-countries-option:checked')) == null ? 0 : GetChecked(template.findAll('.singleInd-countries-option:checked')).length;
    $(template.find('.countries-select-number')).text(num_selected + ' SELECTED');
  },
  'click #deselect-countries': function(ev, template){
    $(template.findAll('.singleInd-countries-option:checked')).each(function(){
      $(this).prop('checked', false);
    });
    var num_selected = GetChecked(template.findAll('.singleInd-countries-option:checked')) == null ? 0 : GetChecked(template.findAll('.singleInd-countries-option:checked')).length;
    $(template.find('.countries-select-number')).text(num_selected + ' SELECTED');
  }
});

function GetChecked(selector){
  return $(selector).map(function(){ return $(this).val(); }).get();
}
