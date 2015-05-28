var closePopover = function(template) {
  // Really a static method, but handy to have here
  var selector = '#' +
    $(template.firstNode).parent().attr('class').replace(/^for-/, '');
  $(selector).popover('hide');
};

_.extend(WidgetData.prototype, {
  closeSettings: closePopover,
  closeInfo: closePopover
});
