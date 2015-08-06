Template.WidgetSettings.onRendered(function() {
  var template = this;
  var showTemplate = Templates.ancestorByName(template, 'Template.WidgetShow');
  showTemplate.$settingsContent = template.$('.widget-settings').detach();
  // Because using the events map doesn't work once detached or something
  showTemplate.$settingsContent.on('click', '.close-settings', function() {
    template.closeSettings();
  });
});

Template.WidgetSettings.helpers({
  settingsTemplate: function() {
    return this.package.templateFor('Settings');
  },
});
