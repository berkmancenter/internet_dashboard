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
  widgetClass: function() {
    return this.packageName;
  },
  widgetMetadata: function() {
    return this.package.metadata();
  },
  titleBar: function() {
    return Widget.Settings.titleBar;
  },
  gridAttrs: function() {
    var resizeConstraints = this.package.widget.resize.constraints;
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
  }
});

Template.WidgetShow.onCreated(function() {
  var self = this;

  _.extend(self, {
    gridUnitsToPixels: function(dims) {
      var dashboard = self.data.dashboard();
      var currentDims = {
        width: self.$('.widget').attr('data-sizex'),
        height: self.$('.widget').attr('data-sizey')
      };
      dims = dims || currentDims;
      _.defaults(dims, currentDims);
      return {
        width: dims.width * dashboard.columnWidth +
          dashboard.gutter * (dims.width - 1),
        height: dims.height * dashboard.rowHeight +
          dashboard.gutter * (dims.height - 1)
      };
    },

    scaleBody: function(newDims) {
      var widget = self.data;
      var $widgetBody = self.$('.widget-body');

      var newPixelDims = self.gridUnitsToPixels(newDims);
      var originalGridDims = widget.package.widget.dimensions;
      var originalPixelDims = self.gridUnitsToPixels(originalGridDims);

      // We're just scaling the body, so don't count the title bar.
      newPixelDims.height -= Widget.Settings.titleBar.height;
      originalPixelDims.height -= Widget.Settings.titleBar.height;

      $widgetBody.css({
        transform: 'scaleX(' + newPixelDims.width / originalPixelDims.width + ') ' +
                   'scaleY(' + newPixelDims.height / originalPixelDims.height + ')'
      });
    }
  });
});

Template.WidgetShow.onRendered(function() {
  var dashboardTemplate = Dashboards.templateFromChild(this);
  var widgetNode = this.firstNode;
  var self = this;
  var resizeMode = self.data.package.widget.resize.mode;

  if (dashboardTemplate.gridster) {
    dashboardTemplate.gridster.add_widget(
      widgetNode, $(widgetNode).data('sizex'), $(widgetNode).data('sizey'));
  } else {
    dashboardTemplate.widgetNodes.push(widgetNode);
  }

  if (resizeMode === 'scale') {
    var originalGridDims = self.data.package.widget.dimensions;
    var originalPixelDims = self.gridUnitsToPixels(originalGridDims);
    originalPixelDims.height -= Widget.Settings.titleBar.height;

    // Pin the width and height so we don't get both reflows and transforms.
    self.$('.widget-body').css(originalPixelDims);
    self.scaleBody();
  }

  // When other clients resize widgets
  self.autorun(function() {
    Widgets.find(self.data._id).observeChanges({
      changed: function(id, fields) {
        if (resizeMode === 'scale' &&
            (_(fields).has('width') || _(fields).has('height'))) {
          self.scaleBody(fields);
        }
      }
    });
  });

  $(widgetNode).popover({
    selector: '[data-toggle="popover"]',
    content: function() {
      var isSettings = $(this).attr('class').indexOf('settings') >= 0;
      return isSettings ? self.$settingsContent.get(0) : self.$infoContent.get(0);
    }
  });

  $(widgetNode).removeClass('hidden');

  if (dashboardTemplate.gridster) {
    Widgets.updatePositions(dashboardTemplate.gridster.serialize());
  }
});

Template.WidgetShow.events({
  'click .remove-widget': function(ev, template) {
    var dashboardTemplate = Dashboards.templateFromChild(template);
    var dashboard = dashboardTemplate.data;
    var widget = this;

    template.closeSettings();
    template.closeInfo();

    dashboardTemplate.gridster.remove_widget(template.firstNode, function() {
      dashboard.removeWidget(widget);
      Widgets.updatePositions(dashboardTemplate.gridster.serialize());
    });
  },
  'gridster:resizestart': function(ev, template) {
    template.closeSettings();
    template.closeInfo();
    if (this.package.widget.resize.mode === 'scale') {
      template.$('.widget-body').append('<div class="resizing-cover" />');
    }
    // This was passed down from the dashboard - don't bubble it back up.
    ev.stopPropagation();
  },
  'gridster:resizestop': function(ev, template) {
    if (this.package.widget.resize.mode === 'scale') {
      template.scaleBody();
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
