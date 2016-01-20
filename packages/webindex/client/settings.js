Template.WebIndexSettings.onCreated(function() {
  this.subscribe('webindex_data');
});

Template.WebIndexSettings.helpers({
  metrics: function(){
    return [
      {name: 'Web Index',            id: 'INDEX'},
      {name: 'Empowerment',      id: 'EMPOWERMENT'},
      {name: 'Political impact', id: 'POLITICAL_IMPACT'},
      {name: 'Economic impact', id: 'ECONOMIC_IMPACT'},
      {name: 'Social and environmental impact', id: 'SOCIAL_AND_ENVIRONMENTAL_IMPACT'},
      {name: 'Relevant content and use', id: 'RELEVANT_CONTENT_AND_USE'},
      {name: 'Freedom and openness', id: 'FREEDOM_AND_OPENNESS'},
      {name: 'Universal access', id: 'UNIVERSAL_ACCESS'},
      {name: 'Education and awareness', id: 'EDUCATION_AND_AWARENESS'},
      {name: 'Access and affordability', id: 'ACCESS_AND_AFFORDABILITY'},
      {name: 'Communications infrastructure', id: 'COMMUNICATIONS_INFRASTRUCTURE'}
    ];
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
