CommonHelpers = {
  widgetTemplate: function() {
    return this.package.templateFor('Widget');
  },
  titleBar: function() {
    return Widget.Settings.titleBar;
  },
  componentId: function(component) {
    return this.componentId(component);
  },
  widgetClasses: function() {
    return 'widget ' + this.packageName + ' resize-' + this.resize.mode +
      (this.showCountry() ? '' : ' country-hidden');
  },
  resizeTransform: function() {
    if (this.resize.mode !== 'scale') { return ''; }
    var newPixelDims = this.pixelDims();
    var originalGridDims = this.package.metadata().widget.dimensions;
    var originalPixelDims = this.pixelDims(originalGridDims);

    // We're just scaling the body, so don't count the title bar.
    newPixelDims.height -= Widget.Settings.titleBar.height;
    originalPixelDims.height -= Widget.Settings.titleBar.height;

    return 'width: ' + originalPixelDims.width + 'px;' +
      'height: ' + originalPixelDims.height + 'px;' +
      'transform: ' +
      'scaleX(' + newPixelDims.width / originalPixelDims.width + ') ' +
      'scaleY(' + newPixelDims.height / originalPixelDims.height + ');';
  },
  resizeEmbed: function(){
    if (this.resize.mode !== 'scale') { return ''; }
    var newPixelDims = this.pixelDims();
    var originalGridDims = this.package.metadata().widget.dimensions;
    var originalPixelDims = this.pixelDims(originalGridDims);

    // We're just scaling the body, so don't count the title bar.
    newPixelDims.height -= Widget.Settings.titleBar.height;
    originalPixelDims.height -= Widget.Settings.titleBar.height;

    return 'width: ' + originalPixelDims.width + 'px;' +
      'height: ' + originalPixelDims.height + 'px;' +
      'scaleX(' + newPixelDims.width / originalPixelDims.width + ') ' +
      'scaleY(' + newPixelDims.height / originalPixelDims.height + ');';
  }
};

CommonOnRendered = function() {
  var template = this;
  var $widgetNode = $(template.firstNode);

  // Hide the widget.
  $widgetNode.addClass('hidden');

  // Associate popover links with the detached settings or info content
  // (detachment happens when the info content is rendered).
  $widgetNode.popover({
    selector: '[data-toggle="popover"]',
    content: function() {
      var isSettings = $(this).attr('class').indexOf('settings') >= 0;
      return isSettings ?
        template.$settingsContent.get(0) : template.$infoContent.get(0);
    }
  });

  // Show the widget.
  $widgetNode.removeClass('hidden');

  $widgetNode.trigger('widget:rendered', [template]);
};
