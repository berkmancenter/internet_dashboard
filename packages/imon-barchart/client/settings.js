Template.IMonBarchartSettings.onCreated(function() {
  this.subscribe('imon_indicators');
  this.subscribe('imon_countries');
});


Template.IMonBarchartSettings.helpers({
  singleIndicator: function() { return Template.currentData().mode === 'single' ? true : false; },
  indicator: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  country: function() { return IMonCountries.find({ isRegion: false }, { sort: { name: 1 } } ); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isChecked: function(a, b) { return a === b ? 'checked' : ''; },
  isInArray: function(val, arr) { return arr.indexOf(val) == -1 ? '' : 'checked'; }, 
  isSorted: function(){ return Template.currentData().sorted ? 'checked' : ''; }
});

Template.IMonBarchartSettings.events({
  'click .save-barchart-settings': function(ev, template) {
    // mode
    var mode = template.find('input[name="mode"]:checked').value;

    // x
    var xValueSingle = GetChecked(template.findAll('.countries-option:checked'));
    var xValueMulti = $(template.find('.indicators-select')).val();
    var xIndicatorSingle = mode === 'single' ? xValueSingle : Template.currentData().x.single.indicator;
    var xIndicatorMulti = mode === 'multi' ? StringToInt(xValueMulti) : Template.currentData().x.multi.indicator;

    // y
    var yIndicatorValue = template.find('#y-select-' + mode).value;
    var yIndicatorSingle = mode === 'single' ? yIndicatorValue : Template.currentData().y.single.indicator;
    var yIndicatorMulti = mode === 'multi' ? yIndicatorValue : Template.currentData().y.multi.indicator;

    var newData = {
      title: template.find('.barchart-title').value,
      mode: mode,
      sorted: template.find('.sort-option').checked,
      x: {
        single:{
          indicator: xIndicatorSingle
        },
        multi: {
          indicator: xIndicatorMulti
        }        
      },
      y: {
        single:{
          indicator: parseInt(yIndicatorSingle)
        },
        multi: {
          indicator: yIndicatorMulti
        }
      }};
    template.closeSettings();
    this.set(newData);
  },
  'change input[name="mode"]': function(ev, template){
    // Show/Hide appropriate settings based on mode selection
    var mode = $(template.find('input[name="mode"]:checked')).val();
    var div = mode === 'single' ? { show: '.single-settings', hide: '.multi-settings' } : { hide: '.single-settings', show: '.multi-settings' };
    $(template.find(div.show)).show();
    $(template.find(div.hide)).hide();
  },
  'change .countries-option': function(ev, template){ 
    var num_selected = GetChecked(template.findAll('.countries-option:checked')) == null ? 0 : GetChecked(template.findAll('.countries-option:checked')).length;
    $(template.find('.countries-select-number')).text(num_selected + ' SELECTED');
  }
});

function StringToInt(arr){
  // Convert an array of strings (of numbers) into an array of integers. Used for array of indicator IDs.
  var res = [];
  for(var i=0; i<arr.length; i++)
    res.push(parseInt(arr[i]));
  return res;
}

function GetChecked(selector){
  return $(selector).map(function(){ return $(this).val(); }).get();
}
