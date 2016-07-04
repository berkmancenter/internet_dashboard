DATA = {};
Template.AccessIndexSettings.onCreated(function() {
  Session.set('hasData', false);
  Meteor.call('rankData', function(e, r){
    DATA = r;
    Session.set('hasData', true);
  });
});

Template.AccessIndexSettings.helpers({
  dataReady: function(){ return Session.get('hasData'); },
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