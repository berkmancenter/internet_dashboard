Template.IMonSettings.helpers({
  countries: function() { return Countries.find({}, { sort: { name: 1 } }); },
  indicators: function(countryCode) {
    return Countries.findOne({ code: countryCode }).indicators;
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.IMonSettings.events({
  'click .save-settings': function(event, template) {
    var countryCode = template.find('.country').val(),
        indicator = template.find('.indicator').val();
    //this.close();
    console.log('save');
    /*
    this.setData({
      country: countryCode,
      indicator: { name: indicator }
    });
    */
  }
});
