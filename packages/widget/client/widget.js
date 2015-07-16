Template.WidgetShow.helpers({
  widgetTemplate: function() {
    return this.templateFor('Widget');
  },
  settingsTemplate: function() {
    return this.templateFor('Settings');
  },
  infoTemplate: function() {
    return this.templateFor('Info');
  },
  providesInfo: function() {
    return this.providesTemplate('Info');
  },
  providesSettings: function() {
    return this.providesTemplate('Settings');
  },
  widgetId: function(aspect) {
    aspect = aspect || 'widget';
    return this.packageName + '-' + this._id + '-' + aspect;
  },
  widgetClass: function() {
    return this.packageName;
  },
  widgetMetadata: function() {
    return this.metadata();
  },
  titleBar: function() {
    return Widget.Settings.titleBar;
  },
  gridAttrs: function() {
    var resizeConstraints = this.metadata().widget.resize.constraints;
    var attrs = {
      'data-sizex': this.width,
      'data-sizey': this.height,
      'data-min-sizex': resizeConstraints.width.min,
      'data-max-sizex': resizeConstraints.width.max,
      'data-min-sizey': resizeConstraints.height.min,
      'data-max-sizey': resizeConstraints.height.max
    };
    if (this.position) {
      attrs['data-row'] = this.position.x;
      attrs['data-col'] = this.position.y;
    }
    return attrs;
  }
});

Template.DefaultWidgetInfo.helpers({
  widgetMetadata: function() {
    return WidgetTypes.findOne({ packageName: this.packageName });
  }
});

Template.DefaultWidgetInfo.events({
  'click .close-info': function(ev, template) {
    this.data.closeInfo(template);
  }
});

Template.WidgetShow.onCreated(function() {
  var self = this;
  self.gridUnitsToPixels = function(dims) {
    var dashboard = self.data.dashboard();
    var currentDims = {
      width: self.$('.widget').attr('data-sizex'),
      height: self.$('.widget').attr('data-sizey')
    };
    dims = dims || currentDims;
    return {
      width: dims.width * dashboard.columnWidth +
        dashboard.gutter * (dims.width - 1),
      height: dims.height * dashboard.rowHeight +
        dashboard.gutter * (dims.height - 1)
    };
  };
  self.scaleBody = function() {
    var widget = self.data;
    var $widgetBody = self.$('.widget-body');

    var currentPixelDims = self.gridUnitsToPixels();
    var originalGridDims = widget.metadata().widget.dimensions;
    var originalPixelDims = self.gridUnitsToPixels(originalGridDims);

    // We're just scaling the body, so don't count the title bar.
    currentPixelDims.height -= Widget.Settings.titleBar.height;
    originalPixelDims.height -= Widget.Settings.titleBar.height;

    $widgetBody.css({
      transform: 'scaleX(' + currentPixelDims.width / originalPixelDims.width + ') ' +
                 'scaleY(' + currentPixelDims.height / originalPixelDims.height + ')'
    });
  };
});

Template.WidgetShow.onRendered(function() {
  var dashboardTemplate = Dashboards.templateFromChild(this);
  var widgetNode = this.firstNode;
  var self = this;

  if (dashboardTemplate.gridster) {
    dashboardTemplate.gridster.add_widget(
      widgetNode, $(widgetNode).data('sizex'), $(widgetNode).data('sizey'));
    Widgets.updatePositions(dashboardTemplate.gridster.serialize());
  } else {
    dashboardTemplate.widgetNodes.push(widgetNode);
  }

  if (this.data.metadata().widget.resize.mode === 'scale') {
    var originalGridDims = self.data.metadata().widget.dimensions;
    var originalPixelDims = self.gridUnitsToPixels(originalGridDims);
    originalPixelDims.height -= Widget.Settings.titleBar.height;

    // Pin the width and height so we don't get both reflows and transforms.
    self.$('.widget-body').css(originalPixelDims);
    self.scaleBody();
  }
});

Template.WidgetShow.events({
  'click .remove-widget': function(ev, template) {
    var dashboardTemplate = Dashboards.templateFromChild(template);
    var dashboard = dashboardTemplate.data;

    dashboardTemplate.gridster.remove_widget(template.firstNode);
    Widgets.updatePositions(dashboardTemplate.gridster.serialize());
    dashboard.removeWidget(this);
  },
  'gridster:resizestart': function(ev, template) {
    if (this.metadata().widget.resize.mode === 'scale') {
      template.$('.widget-body').append('<div class="resizing-cover" />');
    }
    ev.stopPropagation();
  },
  'gridster:resizestop': function(ev, template) {
    if (this.metadata().widget.resize.mode === 'scale') {
      template.scaleBody();
      template.$('.resizing-cover').remove();
    }
    ev.stopPropagation();
  }
});

Template.registerHelper('widgetLoading', function() {
  return 'Loading...';
});
