Template.PercentOnlineSettings.onCreated(function() {
  this.subscribe('imon_countries_v2');
});

Template.PercentOnlineSettings.onRendered(function(){
  var template = this;
  var id = Template.instance().data.widget._id;
  // Logic here is only for single mode
  // 1. Initially fill the years
  var indicator = Settings.indicatorId;
  Meteor.call('getIndicatorYears', indicator, function(error, result){
    Session.set(id+'-years', result);
  });
});

Template.PercentOnlineSettings.helpers({
  year: function(){ var id = Template.instance().data.widget._id; return Session.get(id+'-years'); },
  countries: function() {
    return IMonCountries.find(
        { dataSources: Settings.indicatorId },
        { sort: { name: 1 } });
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.PercentOnlineSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var year = template.find('.year').value;
    var byYear = !(year === 'none');
    var chosenYear = year === 'none' ? '' : parseInt(year);
    var newData = {
      country: IMonCountries.findOne({ code: countryCode }),
      byYear: byYear,
      chosenYear: chosenYear
    };
    template.closeSettings();
    this.set(newData);
  }
});
