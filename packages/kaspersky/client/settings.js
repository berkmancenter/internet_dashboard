Template.KasperskySettings.onCreated(function() {
  this.subscribe('kasp_metrics');
});

Template.KasperskySettings.helpers({
  countries: function() {
    return CountryMetrics.find({}, {
      fields: { name: 1, key: 1 },
      sort: { name: 1 }
    });
  },
  isSelected: function(a, b) { return a === b ? 'selected' : ''; },
});

Template.KasperskySettings.events({
  'click .save-settings': function(ev, template) {
    var country = {
      key: template.find('.country').value,
      name: template.find('.country').selectedOptions[0].innerText
    };
    var newData = { country: country };
    this.set(newData);
    this.closeSettings(template);
  }
});
