Template.IMonSettings.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.IMonSettings.helpers({
  countries: function() { return IMonCountries.find({}, { sort: { name: 1 } }); },
  indicators: function(countryCode) {
    return IMonCountries.findOne({ code: countryCode }).indicators;
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.IMonSettings.events({
  'click .save-settings': function(event, template) {
    var countryCode = template.find('.country').value,
        indicator = template.find('.indicator').value;
    var newData = {
      country: IMonCountries.findOne({ code: countryCode }),
      indicator: this.widget.fetchIndicatorForCountry(indicator, countryCode)
    };
    //this.close();
    this.set(newData);
  }
});
