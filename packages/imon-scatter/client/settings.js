Template.IMonScatterSettings.onCreated(function() {
  this.subscribe('imon_indicators_v2');
});

Template.IMonScatterSettings.onRendered(function(){
  var template = this;
  var id = Template.instance().data.widget._id;
  // Logic here is only for single mode
  // 1. Initially fill the years
  var indicators = [Template.currentData().x.indicator, Template.currentData().y.indicator];
  Meteor.call('getIndicatorYears', indicators, function(error, result){
    Session.set(id+'-years', result);
  });
});

Template.IMonScatterSettings.helpers({
  indicators: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isChecked: function(val) { return val ? 'checked' : ''; },
  year: function(){ var id = Template.instance().data.widget._id; return Session.get(id+'-years'); }
});

Template.IMonScatterSettings.events({
  'click .save-settings': function(ev, template) {
    var year = template.find('#year-select-single').value;
    var byYear = !(year === 'none');
    var chosenYear = year === 'none' ? '' : parseInt(year);
    var newData = {
      title: template.find('#chart-title').value,
      byYear: byYear,
      chosenYear: chosenYear,
      x: {
        indicator: template.find('#x-select').value,
        log: template.find('#x-log').checked,
        jitter: parseInt(template.find('#x-jitter').value)
      },
      y: {
        indicator: template.find('#y-select').value,
        log: template.find('#y-log').checked,
        jitter: parseInt(template.find('#y-jitter').value)
      }};
    template.closeSettings();
    this.set(newData);
  },
  'change #x-select, change #y-select':function(ev, template){
    var id = Template.instance().data.widget._id;
    var indicators = [template.find('#x-select').value, template.find('#y-select').value];
    toggle(template.find('#year-select-single'), true);
    Meteor.call('getIndicatorYears', indicators, function(error, result){
      toggle(template.find('#year-select-single'), false);
      Session.set(id+'-years', result);
    });
  }
});

function toggle(selector, isDisabled){
  $(selector).prop('disabled', isDisabled);
}
