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
  var showTemplate = Templates.ancestorByName(template, 'Template.WidgetShow');
  showTemplate.$infoContent = template.$('.widget-info').detach();

  // Because using the events map doesn't work once detached or something
  showTemplate.$infoContent.on('click', '.close-info', function() {
    template.closeInfo();
  });
});
