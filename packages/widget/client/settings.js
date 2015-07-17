var closePopover = function(widget, component) {
  console.log(widget);
  $('#' + widget.componentId(component)).popover('hide');
};

_.extend(WidgetData.prototype, {
  closeSettings: function(template) { closePopover(template.data.widget, 'settings'); },
  closeInfo: function(template) { closePopover(template.data, 'info'); },
});
