Template.IMonSettings.helpers({
  countries: function() { return Countries.find({}, { sort: { name: 1 } }); },
  indicators: function(countryCode) {
    return Countries.findOne({ code: countryCode }).indicators;
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.IMonSettings.events({
  'click .save-settings': function(event, template) {
    var countryCode = template.find('.country').value,
        indicator = template.find('.indicator').value;
    var newData = {
      country: Countries.findOne({ code: countryCode }),
      indicator: this.widget.fetchIndicatorForCountry(indicator, countryCode)
    };
    //this.close();
    this.set(newData);
  }
});
