Template.AkamaiAttacksWidget.helpers({
  updatedAt: function() { return CountryAttacks.findOne().updatedAt; }
});

Template.AkamaiAttacksWidget.onCreated(function() {
  this.subscribe('country_attacks');
});

Template.AkamaiAttacksWidget.onRendered(function() {
  var template = this;

  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    var docs = CountryAttacks.find({}, { sort: { percentAboveAverage: -1 }, limit: Settings.limit });
    docs.forEach(function(doc) {
      template.$('.akamai-attacks').append('<li>' + doc.regionLabel + ' ' + doc.percentAboveAverage + '</li>');
    });
  });
});
