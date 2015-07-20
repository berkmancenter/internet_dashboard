Template.DefaultWidgetInfo.helpers({
  infoTemplate: function() {
    return this.widget.package.templateFor('Info');
  },
  widgetMetadata: function() {
    return this.widget.package.metadata();
  }
});

Template.WidgetInfo.events({
  'click .close-info': function(ev, template) {
    template.closeInfo();
  }
});
