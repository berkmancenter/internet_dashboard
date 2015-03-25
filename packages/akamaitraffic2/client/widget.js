Template.AkamaiTraffic2Widget.helpers({
  updatedAt: function() { return CountryTraffic.findOne().updatedAt; }
});

Template.AkamaiTraffic2Widget.onCreated(function() {
  this.subscribe('country_traffic');
});

Template.AkamaiTraffic2Widget.onRendered(function() {
  var template = this;

  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    var docs = CountryTraffic.find({}, { sort: { percentAboveAverage: -1 }, limit: Settings.limit });
    template.$('.akamai-traffic').html('');
    docs.forEach(function(doc) {
      template.$('.akamai-traffic').append('<li>' + doc.regionLabel + ' ' + doc.percentAboveAverage + '</li>');
    });
  });
});
