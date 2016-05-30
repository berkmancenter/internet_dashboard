Template.IMonBarchartSettings.onCreated(function() {
  this.subscribe('imon_indicators');
});

Template.IMonBarchartSettings.helpers({
  singleIndicator: function() { return Template.currentData().mode === 'single' ? true : false; },
  indicator: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  country: function() { return IMonCountries.find({}, { sort: { name: 1 } } ); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isChecked: function(a, b) { return a === b ? 'checked' : ''; },
  isInArray: function(val, arr) { 
    var mode = $('input[name="mode"]:checked').val();;
    if(mode==='single')
      return arr.indexOf(val) == -1 ? '' : 'selected'; 
    else
      return arr.indexOf(parseInt(val)) == -1 ? '' : 'selected';
  }
});

Template.IMonBarchartSettings.events({
  'click .save-barchart-settings': function(ev, template) {
    var instance = ev.target.parentElement;
    // mode
    var mode = template.find('input[name="mode"]:checked').value;

    // x
    var xValueSingle = $('#countries-select', instance).val();
    var xValueMulti = $('#indicators-select', instance).val();
    var xIndicatorSingle = mode === 'single' ? xValueSingle : Template.currentData().x.single.indicator;
    var xIndicatorMulti = mode === 'multi' ? StringToInt(xValueMulti) : Template.currentData().x.multi.indicator;

    // y
    var yIndicatorValue = $('#y-select-' + mode, instance).val();
    var yIndicatorSingle = mode === 'single' ? yIndicatorValue : Template.currentData().y.single.indicator;
    var yIndicatorMulti = mode === 'multi' ? yIndicatorValue : Template.currentData().y.multi.indicator;

    var newData = {
      title: $('#chart-title', instance).val(),
      mode: mode,
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
    console.log(newData);
    template.closeSettings();
    this.set(newData);
  },
  'change input[name="mode"]': function(ev, template){
    var instance = ev.target.parentElement;
    var mode = $('input[name="mode"]:checked', instance).val();
    var div = mode === 'single' ? { show: '.single-settings', hide: '.multi-settings' } : { hide: '.single-settings', show: '.multi-settings' };
    $(div.show).show();
    $(div.hide).hide();
    var oldData = Template.currentData();
    var newData = {
      title: oldData.title,
      mode: mode,
      x: oldData.x,
      y: oldData.y
    }
    this.set(newData);
  },
  'mousedown .multi-option': function(ev, template){ // Remove the need to hold down ctrl in order to select countries
    ev.preventDefault();
    var instance = ev.target.parentElement;
    var scroll_offset = instance.scrollTop;
    var mode = $('input[name="mode"]:checked', instance).val();
    var selectionBox = mode === 'single' ? '#countries-select' : '#indicators-select';
    ev.target.selected = !ev.target.selected;
    instance.scrollTop = scroll_offset; // Prevent scrolling away when selection is toggled
    var num_selected = $(selectionBox, instance).val() == null ? 0 : $(selectionBox, instance).val().length;
    $(selectionBox + '-number', instance).text(num_selected + ' SELECTED');
  }
});

function StringToInt(arr){
  var res = [];
  for(var i=0; i<arr.length; i++)
    res.push(parseInt(arr[i]));
  return res;
}
