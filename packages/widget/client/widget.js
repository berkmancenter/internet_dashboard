Template.WidgetShow.helpers({
  widgetTemplate: function() {
    return this.package.templateFor('Widget');
  },
  providesInfo: function() {
    return this.package.providesTemplate('Info');
  },
  providesSettings: function() {
    return this.package.providesTemplate('Settings');
  },
  componentId: function(component) {
    return this.componentId(component);
  },
  widgetClasses: function() {
    return 'widget ' + this.packageName + ' resize-' + this.resize.mode;
  },
  titleBar: function() {
    return Widget.Settings.titleBar;
  },
  gridAttrs: function() {
    var resizeConstraints = this.resize.constraints;
    var attrs = {
      'data-sizex': this.width,
      'data-sizey': this.height,
      'data-min-sizex': resizeConstraints.width.min,
      'data-max-sizex': resizeConstraints.width.max,
      'data-min-sizey': resizeConstraints.height.min,
      'data-max-sizey': resizeConstraints.height.max
    };
    if (this.position) {
      attrs['data-row'] = this.position.row;
      attrs['data-col'] = this.position.col;
    }
    return attrs;
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

Template.WidgetShow.onRendered(function() {
  var template = this;
  var $widgetNode = $(template.firstNode);

  $widgetNode.addClass('hidden');

  $widgetNode.popover({
    selector: '[data-toggle="popover"]',
    content: function() {
      var isSettings = $(this).attr('class').indexOf('settings') >= 0;
      return isSettings ? template.$settingsContent.get(0) : template.$infoContent.get(0);
    }
  });

  $widgetNode.removeClass('hidden');

  $widgetNode.trigger('widget:rendered', [template]);
});

Template.WidgetShow.onDestroyed(function() {
  this.resizeQuery.stop();
  $('#' + this.data.componentId()).trigger('widget:destroyed', [this]);
});

Template.WidgetShow.events({
  'click .remove-widget': function(ev, template) {
    var dashboardTemplate = Dashboards.templateFromChild(template);
    var dashboard = dashboardTemplate.data;
    var widget = this;

    template.closeSettings();
    template.closeInfo();

    dashboard.removeWidget(widget);
  },
  'gridster:resizestart': function(ev, template) {
    template.closeSettings();
    template.closeInfo();
    if (this.resize.mode === 'scale') {
      template.$('.widget-body').append('<div class="resizing-cover" />');
    }
    // This was passed down from the dashboard - don't bubble it back up.
    ev.stopPropagation();
  },
  'gridster:resizestop': function(ev, template) {
    if (this.resize.mode === 'scale') {
      template.$('.widget-body .resizing-cover').remove();
    }
    // This was passed down from the dashboard - don't bubble it back up.
    ev.stopPropagation();
  }
});

Template.registerHelper('widgetLoading', function() {
  return 'Loading...';
});

Template.WidgetShow.closePopover = function(widget, component) {
  $('#' + widget.componentId(component)).popover('hide');
};

var extendTemplate = function(template, attrs) {
  template.onCreated(function() {
    _.extend(this, attrs);
  });
};

var extendAllTemplates = function(aspect, attrs) {
  aspect = aspect || 'Widget';
  WidgetPackages.find().observe({
    added: function(package) {
      if (!package.providesTemplate(aspect)) { return; }
      extendTemplate(Template[package.templateFor(aspect)], attrs);
    }
  });
};

var addPopoverCloser = function(popoverName) {
  var closeForTemplate = function() {
    var widget;
    if (this.data.constructor === WidgetData) {
      widget = this.data.widget;
    } else {
      widget = this.data;
    }
    Template.WidgetShow.closePopover(widget, popoverName);
  };

  attrs = {};
  attrs['close' + popoverName] = closeForTemplate;

  extendTemplate(Template.WidgetShow, attrs);
  extendTemplate(Template['Widget' + popoverName], attrs);

  extendAllTemplates(popoverName, attrs);
};

Templates = {
  ancestorByName: function(template, name) {
    var view = template.view;
    while (view.name !== name && view.parentView) {
      view = view.parentView;
    }
    return view.templateInstance();
  }
};

addPopoverCloser('Settings');
addPopoverCloser('Info');
