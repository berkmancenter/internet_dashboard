
Template.RDRSettings.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('ranking_digital_rights_companies');
  });
});

Template.RDRSettings.helpers({
  granularities: function() { return Settings.granularities; },
  companies: function() { return RDRCompanyData.find({}) },
  categories: function() { return Settings.categories; },
  metrics: function() { return Settings.metrics; },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; }
});

Template.RDRSettings.events({
  'click .save-settings': function(ev, template) {
    var newData = {
      granularity: template.find('#granularity-select').value,
      category: template.find('#category-select').value,
      sortMetric: template.find('#sort-metric').value,
      company: template.find('#company-select').value
    };
    this.set(newData);
    template.closeSettings();
  }
});
