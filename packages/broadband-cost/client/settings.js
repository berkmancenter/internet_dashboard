Template.BroadbandCostSettings.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.BroadbandCostSettings.helpers({
  countries: function() { return IMonCountries.find({}, { sort: { name: 1 } }); },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  indicators: function() {
    return _.map(Settings.indicatorNames, function(name) {
      return { name: name };
    });
  }
});

Template.BroadbandCostSettings.events({
  'click .save-settings': function(ev, template) {
    var countryCode = template.find('.country').value;
    var indicatorName = template.find('.indicator').value;
    var newData = {
      country: IMonCountries.findOne({ code: countryCode }),
      indicator: { name: indicatorName }
    };
    //this.close();
    this.set(newData);
    this.set({ indicator: this.widget.getIndicator() });
  }
});
