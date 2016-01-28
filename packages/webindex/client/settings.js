
Template.WebIndexSettings.metrics = [
    {name: 'Web Index',            id: 'INDEX', level: 0},
    {name: 'Empowerment',      id: 'EMPOWERMENT', level: 1},
    {name: 'Political impact', id: 'POLITICAL_IMPACT', level: 2},
    {name: 'Economic impact', id: 'ECONOMIC_IMPACT', level: 2},
    {name: 'Social and environmental impact', id: 'SOCIAL_AND_ENVIRONMENTAL_IMPACT', level: 2},
    {name: 'Relevant content and use', id: 'RELEVANT_CONTENT_AND_USE', level: 1},
    {name: 'Freedom and openness', id: 'FREEDOM_AND_OPENNESS', level: 1},
    {name: 'Universal access', id: 'UNIVERSAL_ACCESS', level: 1},
    {name: 'Education and awareness', id: 'EDUCATION_AND_AWARENESS', level: 2},
    {name: 'Access and affordability', id: 'ACCESS_AND_AFFORDABILITY', level: 2},
    {name: 'Communications infrastructure', id: 'COMMUNICATIONS_INFRASTRUCTURE', level: 2}
];

Template.WebIndexSettings.defaultMetric = Template.WebIndexSettings.metrics[0];

Template.WebIndexSettings.onCreated(function() {
  this.subscribe('webindex_data');
});

Template.WebIndexSettings.helpers({
  metrics: function (){ return Template.WebIndexSettings.metrics; },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  indentedName: function(name,level) { return Array((level)*4).join('&nbsp;') + name; }
});

Template.WebIndexSettings.events({
  'click .save-settings': function(ev, template) {
    var metric = {
      id: template.find('.metric').value,
      name: template.find('.metric').selectedOptions[0].innerText.trim()
    };
    var newData = { metric: metric };
    this.set(newData);
    template.closeSettings();
  }
});
