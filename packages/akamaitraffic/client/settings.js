Template.AkamaiTrafficSettings.helpers({
  regions: function() { return Settings.regions; },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.AkamaiTrafficSettings.events({
  'click .save': function(e, template) {
    var regionCode = template.$('#akamai-traffic-region').val();
    var regionLabel = _.where(Settings.regions, { code: regionCode })[0].name;
    this.set({
      regionId: regionCode,
      regionLabel: regionLabel
    });
    template.closeSettings();
  }
});
