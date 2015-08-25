Template.WidgetsEmbed.helpers({
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
  resizeTransform: function() {
    if (this.resize.mode === 'reflow') { return ''; }
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
  }
});

Template.WidgetEmbedCode.helpers({
  embedAttrs: function() {
    return 'src="' + Meteor.absoluteUrl('widgets/' + this._id + '/embed') + '" ' +
      'width="' + this.pixelDims().width + '" ' +
      'height="' + this.pixelDims().height + '"';
  }
});

Template.WidgetsEmbed.onRendered(function() {
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
});
