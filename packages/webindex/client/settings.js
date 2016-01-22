Template.WebIndexSettings.onCreated(function() {
  this.subscribe('webindex_data');
});

Template.WebIndexSettings.helpers({
  metrics: function (){ return WebIndex.metrics; },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
  indentedName: function(name,level) { return Array((level)*4).join('&nbsp;') + name; }
});


Template.WebIndexSettings.events({
  'click .save-settings': function(ev, template) {
    var metric = {
      id: template.find('.metric').value,
      name: template.find('.metric').selectedOptions[0].innerText
    };
    var newData = { metric: metric };
    this.set(newData);
    template.closeSettings();
  }
});
