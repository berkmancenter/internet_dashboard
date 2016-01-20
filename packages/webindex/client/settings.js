Template.WebIndexSettings.onCreated(function() {
  this.subscribe('webindex_data');
});

Template.WebIndexSettings.helpers({
  // note: temporary hack. We should move metrics into their own Mongo Document.
  metrics: function() {
    return WebIndexData.find({countryCode:'USA',year:'2013'}, {
      fields: { metricName: 1, metricId: 1 },
      sort: { metricName: 1 }
    });
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});


Template.WebIndexSettings.events({
  'click .save-settings': function(ev, template) {
    var metric = {
      id: template.find('.metric').value,
      name: template.find('.metric').selectedOptions[0].innerText
    };
    console.log('Saving webindex widget setting: ' , metric);
    var newData = { metric: metric };
    this.set(newData);
    template.closeSettings();
  }
});
