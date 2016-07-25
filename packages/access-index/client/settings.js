DATA = {};

Template.AccessIndexSettings.onRendered(function() {
  var id = Template.instance().data.widget._id;
  var currData = Session.get(id+'-data');
  if(!currData){ // this shouldn't happen, as AccessIndexWidget should handle it on render.
    Meteor.call('rankData', function(e, r){
      DATA = r;
      Session.set(id+'-data', true);
    });
  }
});

Template.AccessIndexSettings.helpers({
  dataReady: function(){ return Session.get(Template.instance().data.widget._id+'-data'); },
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