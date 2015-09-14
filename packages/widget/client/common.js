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
    return 'widget ' + this.packageName + ' resize-' + this.resize.mode;
  },
  bodyResizeStyle: function() {
    if (this.resize.mode === 'reflow') { return ''; }
    var transforms = CommonHelpers.resizeTransforms.bind(this)();
    var transform = 'transform: ' + transforms.join(' ') + ';';
    var originalGridDims = this.package.metadata().widget.dimensions;
    var originalPixelDims = this.pixelDims(originalGridDims);
    originalPixelDims.height -= Widget.Settings.titleBar.height;

    return 'width: ' + originalPixelDims.width + 'px; ' +
      'height: ' + originalPixelDims.height + 'px; ' +
      transform;
  },
  resizeTransforms: function(template) {
    if (this.resize.mode === 'reflow') { return []; }
    var newPixelDims = this.pixelDims();
    var originalPixelDims;

    if (template && this.resize.selector) {
      var $resizable = template.$(this.resize.selector);
      originalPixelDims = { 
        width: $resizable.outerWidth(),
        height: $resizable.outerHeight()
      };
      newPixelDims.height -= $resizable.position().top;
      newPixelDims.width -= $resizable.position().left;
      console.log(originalPixelDims);
      console.log(newPixelDims);
    } else {
      var originalGridDims = this.package.metadata().widget.dimensions;
      originalPixelDims = this.pixelDims(originalGridDims);

      // We're just scaling the body, so don't count the title bar.
      newPixelDims.height -= Widget.Settings.titleBar.height;
      originalPixelDims.height -= Widget.Settings.titleBar.height;
    }

    var scaleX = newPixelDims.width / originalPixelDims.width;
    var scaleY = newPixelDims.height / originalPixelDims.height;
    if (this.resize.freeAspect) {
      return [ 'scaleX(' + scaleX + ')', 'scaleY(' + scaleY + ')' ];
    }
    var scale = Math.min(scaleX, scaleY);
    return [ 'scale(' + scale + ')' ];
  }
};

CommonOnRendered = function() {
  var template = this;
  var $widgetNode = $(template.firstNode);

  $widgetNode.addClass('hidden');

  $widgetNode.popover({
    selector: '[data-toggle="popover"]',
    content: function() {
      var isSettings = $(this).attr('class').indexOf('settings') >= 0;
      return isSettings ?
        template.$settingsContent.get(0) : template.$infoContent.get(0);
    }
  });

  $widgetNode.removeClass('hidden');

  $widgetNode.trigger('widget:rendered', [template]);
};
