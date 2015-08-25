Template.WidgetInfo.helpers({
  providesInfo: function() {
    return this.package.providesTemplate('Info');
  },
  infoTemplate: function() {
    return this.package.templateFor('Info');
  },
});

Template.WidgetInfo.onRendered(function() {
  var template = this;
  var templates = ['WidgetShow', 'WidgetsEmbed'];
  var infoTemplate;

  _.each(templates, function(templateName) {
    var widgetTemplate =
      Templates.ancestorByName(template, 'Template.' + templateName);
    if (widgetTemplate) {
      if (template.$('.widget-info').length > 0) {
        infoTemplate = template.$('.widget-info').detach();
      }
      widgetTemplate.$infoContent = infoTemplate;

      // Because using the events map doesn't work once detached or something
      widgetTemplate.$infoContent.on('click', '.close-info', function() {
        template.closeInfo();
      });
    }
  });
});
