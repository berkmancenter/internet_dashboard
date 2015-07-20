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
      attrs['data-row'] = this.position.x;
      attrs['data-col'] = this.position.y;
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

  if (dashboardTemplate.gridster) {
    dashboardTemplate.gridster.add_widget(
      widgetNode, $(widgetNode).data('sizex'), $(widgetNode).data('sizey'));
    Widgets.updatePositions(dashboardTemplate.gridster.serialize());
  } else {
    dashboardTemplate.widgetNodes.push(widgetNode);
  }

  if (self.data.package.widget.resize.mode === 'scale') {
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
        if (_(fields).has('width') || _(fields).has('height')) {
          self.scaleBody(fields);
        }
      }
    });
  });

  self.$infoContent = self.$('.widget-info').detach();
  self.$settingsContent = self.$('.widget-settings').detach();

  $(widgetNode).popover({
    selector: '[data-toggle="popover"]',
    content: function() {
      var isSettings = $(this).attr('class').indexOf('settings') >= 0;
      return isSettings ? self.$settingsContent.get(0) : self.$infoContent.get(0);
    }
  });

  $(widgetNode).removeClass('hidden');
});

Template.WidgetShow.events({
  'click .remove-widget': function(ev, template) {
    var dashboardTemplate = Dashboards.templateFromChild(template);
    var dashboard = dashboardTemplate.data;

    Template.WidgetShow.closePopover(this, 'Settings');
    Template.WidgetShow.closePopover(this, 'Info');

    dashboardTemplate.gridster.remove_widget(template.firstNode);
    Widgets.updatePositions(dashboardTemplate.gridster.serialize());
    dashboard.removeWidget(this);
  },
  'gridster:resizestart': function(ev, template) {
    if (this.package.widget.resize.mode === 'scale') {
      template.$('.widget-body').append('<div class="resizing-cover" />');
    }
    // This was passed down from the dashboard - don't bubble it back up.
    ev.stopPropagation();
  },
  'gridster:resizestop': function(ev, template) {
    if (this.package.widget.resize.mode === 'scale') {
      template.scaleBody();
      template.$('.resizing-cover').remove();
    }
    ev.stopPropagation();
  },
});

Template.registerHelper('widgetLoading', function() {
  return 'Loading...';
});

Template.WidgetShow.closePopover = function(widget, component) {
  $('#' + widget.componentId(component)).popover('hide');
};

var addPopoverCloserToTemplate = function(template, popoverName) {
  var closeForTemplate = function() {
    var widget;
    if (this.data.constructor === WidgetData) {
      widget = this.data.widget;
    } else {
      widget = this.data;
    }
    Template.WidgetShow.closePopover(widget, popoverName);
  };
  template.onCreated(function() {
    this['close' + popoverName] = closeForTemplate;
  });
};

var addPopoverCloser = function(popoverName) {
  addPopoverCloserToTemplate(Template['Widget' + popoverName], popoverName);

  WidgetPackages.find().observe({
    added: function(package) {
      if (!package.providesTemplate(popoverName)) { return; }
      addPopoverCloserToTemplate(
          Template[package.templateFor(popoverName)], popoverName);
    }
  });
};

addPopoverCloser('Settings');
addPopoverCloser('Info');
