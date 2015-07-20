Template.WidgetSettings.helpers({
  settingsTemplate: function() {
    return this.package.templateFor('Settings');
  },
});
Template.WidgetSettings.events({
  'click .close-settings': function(ev, template) {
    template.closeSettings();
  }
});
