
Template.RDRSettings.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('ranking_digital_rights_companies');
  });
});

Template.RDRSettings.onRendered(function() {
  var template = this;
  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }
    setRightDropDowns(template);
  });
});

Template.RDRSettings.helpers({
  granularities: function()    { return Settings.granularities; },
  companies:     function()    { return RDRCompanyData.find({}) },
  categories:    function()    { return Settings.categories; },
  companyTypes:  function()    { return Settings.companyTypes; },
  metrics:       function()    { return Settings.metrics; },
  isSelected:    function(a,b) { return a === b ? 'selected' : ''; }
});

var showDropDown = function showFilter(template,filterName){
  $(template.find('#category-form-group')).hide();
  $(template.find('#company-form-group')).hide();
  $(template.find('#companyType-form-group')).hide();
  $(template.find('#' + filterName + '-form-group')).show();
};

var setRightDropDowns = function setRightDropDowns(template){
  var granularity = template.find('#granularity-select').value;
  if (granularity === Settings.SERVICES_BY_COMPANY){
    showDropDown(template,'company');
  } else if ( granularity  === Settings.SERVICES_BY_CATEGORY){
    showDropDown(template,'category');
  } else if ( granularity === Settings.COMPANIES_BY_TYPE){    
    showDropDown(template,'companyType');
  } else {
    console.log("Error: unknown granularity: ", granularity);
  }
};

Template.RDRSettings.events({
  'change #granularity-select' : function(ev,template) {
    setRightDropDowns(template);
  },
  'click .save-settings': function(ev, template) {
    var newData = {
      granularity: template.find('#granularity-select').value,
      category: template.find('#category-select').value,
      sortMetric: template.find('#sort-metric').value,
      companyType: template.find('#companyType-select').value,
      companyName: template.find('#company-select').value
    };
    this.set(newData);
    template.closeSettings();
  }
  
});
