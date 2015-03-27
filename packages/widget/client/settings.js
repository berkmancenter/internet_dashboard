_.extend(WidgetData.prototype, {
  closeSettings: function(template) {
    // Really a static method, but handy to have here
    var selector = '#' +
      $(template.firstNode).parent().attr('class').replace(/^for-/, '');
    $(selector).popover('hide');
  }
});
