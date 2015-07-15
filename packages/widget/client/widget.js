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
  self.scaleBody = function() {
    var widget = self.data;
    var dashboard = widget.dashboard();
    var $widgetBody = self.$('.widget-body');
    var originalDims = widget.metadata().widget.dimensions;

    $widgetBody.css({
      width: '',
      height: ''
    });

    var currentWidth = $widgetBody.outerWidth();
    var currentHeight = $widgetBody.outerHeight() -
      Widget.Settings.titleBar.height;
    var originalWidth = originalDims.width * dashboard.columnWidth +
      dashboard.gutter * (originalDims.width - 1);
    var originalHeight = originalDims.height * dashboard.rowHeight +
      dashboard.gutter * (originalDims.height - 1) -
      Widget.Settings.titleBar.height;

    $widgetBody.css({
      width: originalWidth,
      height: originalHeight
    });

    $widgetBody.css({
      transform: 'scaleX(' + currentWidth / originalWidth + ') ' +
                 'scaleY(' + currentHeight / originalHeight + ')'
    });
  };
});

Template.WidgetShow.onRendered(function() {
  var dashboardTemplate = Dashboards.templateFromChild(this);
  var widgetNode = this.firstNode;

  if (dashboardTemplate.gridster) {
    dashboardTemplate.gridster.add_widget(widgetNode);
    Widgets.updatePositions(dashboardTemplate.gridster.serialize());
  } else {
    dashboardTemplate.widgetNodes.push(widgetNode);
  }

  if (this.data.metadata().widget.resize.mode === 'scale') {
    this.scaleBody();
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
