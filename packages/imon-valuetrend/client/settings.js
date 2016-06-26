Template.IMonValuetrendSettings.onCreated(function(){
  var template = this;
  template.autorun(function(){
    template.subscribe('imon_dev');
    template.subscribe('imon_countries_dev');
    template.subscribe('imon_indicators');
  });
});

Template.IMonValuetrendSettings.helpers({
  countries: function() { return IMonCountriesDev.find({}, { sort: { name: 1 } }); },
  indicators: function() { return IMonIndicators.find({ adminName: { $nin: ['ONIco', 'ONIs', 'ONIp', 'ONIit', 'ONIcs', 'ONItr']}}, { sort: { shortName: 1 } }); },
  isSelected: function(a, b) { return a == b ? 'selected' : ''; },
});

Template.IMonValuetrendSettings.events({
  'click .save-settings': function(ev, template) {
    var country = template.find('.country').value;
    var ind = template.find('.indicator').value;
    var newData = {
      country: country,
      indicatorName: ind
    };
    if(_.isUndefined(IMonDev.find({ countryCode: country, indAdminName: ind }))) { console.log("No data found!"); }
    template.closeSettings();
    this.set(newData);
  }
});
