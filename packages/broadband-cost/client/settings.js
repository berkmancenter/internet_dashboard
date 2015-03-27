Template.BroadbandCostSettings.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.BroadbandCostSettings.helpers({
  countries: function() { return IMonCountries.find({}, { sort: { name: 1 } }); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.BroadbandCostSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var newData = {
      country: IMonCountries.findOne({ code: countryCode })
    };
    //this.close();
    console.log(this);
    console.log(template);
    console.log(ev);
    this.set(newData);
  }
});
