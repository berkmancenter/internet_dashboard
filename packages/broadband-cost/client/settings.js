Template.BroadbandCostSettings.onCreated(function() {
  this.subscribe('imon_countries_v2');
});

Template.BroadbandCostSettings.onRendered(function(){
  var template = this;
  var id = Template.instance().data.widget._id;
  // Logic here is only for single mode
  // 1. Initially fill the years
  var indicator = Settings.indicatorIds;
  Meteor.call('getIndicatorYears', indicator, function(error, result){
    Session.set(id+'-years', result);
  });
});

Template.BroadbandCostSettings.helpers({
  countries: function() { return IMonCountries.find({}, { sort: { name: 1 } });},
  year: function(){ var id = Template.instance().data.widget._id; return Session.get(id+'-years'); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.BroadbandCostSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var year = template.find('.year').value;
    var byYear = !(year === 'none');
    var chosenYear = year === 'none' ? '' : parseInt(year);

    var newData = {
      country: {
        name: IMonCountries.findOne({ code: countryCode }).name,
        code: countryCode
      },
      byYear: byYear,
      chosenYear: chosenYear
    };
    this.set(newData);
    template.closeSettings();
  }
});

