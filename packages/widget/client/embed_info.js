Template.WidgetEmbedInfo.helpers({
  providesInfo: function() {
    return this.package.providesTemplate('Info');
  },
  infoTemplate: function() {
    return this.package.templateFor('Info');
  },
});

Template.WidgetEmbedInfo.onRendered(function() {
  var template = this;
});

Template.WidgetEmbedInfo.events({
  'click .close-info': function(e, template) {
    $(template.firstNode).addClass('hidden');
  }
});
