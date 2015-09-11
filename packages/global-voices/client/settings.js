Template.GlobalVoicesSettings.helpers({
  countries: function() {
    return _.filter(CountryInfo.countries, function(country) {
      return !!_.findWhere(feedUrls, { code: country.code });
    });
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.GlobalVoicesSettings.events({
  'click #gv-save': function(ev, template) {
    var countryCode = template.$('#country-select').val();
    this.set({ feed: _.findWhere(feedUrls, { code: countryCode }) });
    template.closeSettings();
  }
});

