Template.IMonBarchartSettings.onCreated(function() {
  var template = this;
  template.subscribe('imon_indicators_v2');
  template.subscribe('imon_countries_v2');
});

Template.IMonBarchartSettings.onRendered(function(){
  var template = this;
  var id = Template.instance().data.widget._id;
  // Initially fill the years
  var indicator = Template.currentData().y.single.indicator;
  Meteor.call('getIndicatorYears', indicator, function(error, result){
    Session.set(id+'-years', result);
  });
});


Template.IMonBarchartSettings.helpers({
  singleIndicator: function() { return Template.currentData().mode === 'single' ? true : false; },
  indicator: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  country: function() { return IMonCountries.find({}, { sort: { name: 1 } } ); },
  year: function(){ var id = Template.instance().data.widget._id; return Session.get(id+'-years'); },
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
    var xValueMulti = $(template.find('.indicators-select')).val(); // move this to new selection technique when multi is available
    var xIndicatorSingle = mode === 'single' ? xValueSingle : Template.currentData().x.single.indicator;
    var xIndicatorMulti = mode === 'multi' ? xValueMulti : Template.currentData().x.multi.indicator;

    // y
    var yIndicatorValue = template.find('#y-select-' + mode).value;
    var yIndicatorSingle = mode === 'single' ? yIndicatorValue : Template.currentData().y.single.indicator;
    var yIndicatorMulti = mode === 'multi' ? yIndicatorValue : Template.currentData().y.multi.indicator;

    //years
    var year = template.find('#year-select-single').value;
    var byYear = !(year === 'none');
    var chosenYear = year === 'none' ? '' : parseInt(year);

    var newData = {
      title: template.find('.barchart-title').value,
      mode: mode,
      sorted: template.find('.sort-option').checked,
      byYear: byYear,
      chosenYear: chosenYear,
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
          indicator: yIndicatorSingle
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
  'change #y-select-single': function(ev, template){
    var id = Template.instance().data.widget._id;
    var indicator = template.find('#y-select-single').value;
    toggle(template.find('#year-select-single'), true);
    Meteor.call('getIndicatorYears', indicator, function(error, result){
      toggle(template.find('#year-select-single'), false);
      Session.set(id+'-years', result);
    });
  },
  'change .countries-option': function(ev, template){ 
    var num_selected = GetChecked(template.findAll('.countries-option:checked')) == null ? 0 : GetChecked(template.findAll('.countries-option:checked')).length;
    $(template.find('.countries-select-number')).text(num_selected + ' SELECTED');
  },
  'click #deselect-countries': function(ev, template){
    $(template.findAll('.countries-option:checked')).each(function(){
      $(this).prop('checked', false);
    });
    var num_selected = GetChecked(template.findAll('.countries-option:checked')) == null ? 0 : GetChecked(template.findAll('.countries-option:checked')).length;
    $(template.find('.countries-select-number')).text(num_selected + ' SELECTED');
  }
});


function GetChecked(selector){
  return $(selector).map(function(){ return $(this).val(); }).get();
}

function toggle(selector, isDisabled){
  $(selector).prop('disabled', isDisabled);
}