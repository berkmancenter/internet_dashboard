Template.IMonBarchartSettings.onCreated(function() {
  this.subscribe('imon_indicators');
});

Template.IMonBarchartSettings.helpers({
  indicators: function() { return IMonIndicators.find({}, { sort: { shortName: 1 }}); },
  country: function() { return IMonCountries.find({}, { sort: { name: 1 } } ); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  isInArray: function(val, arr) { return arr.indexOf(val) == -1 ? '' : 'selected'; }
});

Template.IMonBarchartSettings.events({
  'click .save-settings': function(ev, template) {
    var selection = template.find('#countries-select');
    if($(selection).val() == null) { return; }
    var newData = {
      title: template.find('#chart-title').value,
      x: {
        indicator: $(selection).val()
      },
      y: {
        indicator: parseInt(template.find('#y-select').value)
      }};
    template.closeSettings();
    this.set(newData);
  },
  'mousedown .country': function(ev, template){ // Remove the need to hold down ctrl in order to select countries
    ev.preventDefault();
    var scroll_offset = ev.target.parentElement.scrollTop;
    var selection = template.find('#countries-select');
    ev.target.selected = !ev.target.selected;
    ev.target.parentElement.scrollTop = scroll_offset; // Prevent scrolling away when selection is toggled
    var num_selected = $(selection).val() == null ? 0 : $(selection).val().length;
    $(template.find('#countries-select-number')).text(num_selected + ' SELECTED');
  }
});
