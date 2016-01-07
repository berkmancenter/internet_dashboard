Template.WidgetShow.helpers(_.extend(CommonHelpers, {
  providesInfo: function() {
    return this.package.providesTemplate('Info');
  },
  providesSettings: function() {
    return this.package.providesTemplate('Settings');
  },
  infoShouldShow: function() {
    return !!this.package.metadata().org || !!this.package.providesTemplate('Info');
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
  selecting: function() { return Session.get('selecting'); },
  selectable: function() {
    return _.contains(Session.get('selectable'), this._id);
  },
  categoryStyle: function() {
    return 'background-color: ' + tinycolor(this.category().color).lighten(20);
  }
}));

Template.WidgetShow.onRendered(CommonOnRendered);

Template.WidgetShow.onDestroyed(function() {
  $('#' + this.data.componentId()).trigger('widget:destroyed', [this]);
});

Template.WidgetShow.events({
  'click .remove-widget': function(ev, template) {
    var dashboardTemplate = Dashboards.templateFromChild(template);
    var dashboard = dashboardTemplate.data;
    var widget = this;

    template.closeSettings();
    template.closeInfo();

    dashboard.removeWidget(widget, function() {
      var $widgets = dashboardTemplate.$('.widget');
      $widgets.on('transitionend', function(ev) {
        // Once one widget has finished moving, remove the handler and update
        // the positions in the DB.
        if (ev.originalEvent.propertyName === 'top') {
          $widgets.off('transitionend');
          Widgets.updatePositions(dashboardTemplate.gridster.serialize());
        }
      });
    });
  },
  'gridster:resizestart': function(ev, template) {
    template.closeSettings();
    template.closeInfo();
    if (this.resize.mode === 'scale' || this.resize.mode === 'cover') {
      template.$('.widget-body').append('<div class="resizing-cover" />');
    }
    // This was passed down from the dashboard - don't bubble it back up.
    ev.stopPropagation();
  },
  'gridster:resizestop': function(ev, template) {
    if (this.resize.mode === 'scale' || this.resize.mode === 'cover') {
      template.$('.widget-body .resizing-cover').remove();
    }
    // This was passed down from the dashboard - don't bubble it back up.
    ev.stopPropagation();
  },
  'change .select-check input[type=checkbox]': function(ev, template) {
    var selected = Session.get('selected');
    if (ev.target.checked && !_.contains(selected, this._id)) {
      selected.push(this._id);
    } else {
      selected = _.without(selected, this._id);
    }
    Session.set('selected', selected);
  },
  'click .selecting-cover': function(ev, template) {
    if ($(ev.target).hasClass('selecting-cover')) {
      var checkbox = template.$('.select-check input[type=checkbox]');
      checkbox.click();
    }
  },
  'transitionend': function(ev, template) {
    //console.log('end');
    //console.log(ev);
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
