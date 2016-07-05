DATA = {};

Template.AccessIndexSettings.onRendered(function() {
  var currData = Template.currentData();
  if(!currData.rData){ // this shouldn't happen, as AccessIndexWidget should handle it on render.
    Meteor.call('rankData', function(e, r){
      DATA = r;
      currData.set({ rData: r });
    });
  }
});

Template.AccessIndexSettings.helpers({
  dataReady: function(){ return Template.currentData().rData; },
  countries: function() { return toArray(DATA); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.AccessIndexSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: DATA[countryCode]
    };
    template.closeSettings();
    this.set(newData);
  }
});

function toArray(obj){
  var arr = [];
  for(row in obj)
    arr.push(obj[row]);
  return arr;
}