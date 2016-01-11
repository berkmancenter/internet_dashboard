Template.DashboardsShow.helpers({
  test: function() {
    console.log('rendered dash');
  },
  widgets: function() {
    return Widgets.find({ dashboardId: this._id });
  },
  noWidgets: function() {
    return Widgets.find({ dashboardId: this._id }).count() === 0;
  },
  duplicating: function() { return Session.get('duplicating'); },
  duplicatingState: function() {
    return Session.get('duplicating') ? 'active' : '';
  },
  duplicatingTitle: function() {
    return Session.get('duplicating') ? 'Click to finish' : 'Copy widgets';
  },
  settingCountry: function() { return Session.get('setting-country'); },
  settingCountryState: function() {
    return Session.get('setting-country') ? 'active' : '';
  },
  settingCountryTitle: function() {
    return Session.get('setting-country') ? 'Click to finish' :
      'Set country for multiple widgets';
  },
  width: function() {
    var maxCol = _.max(this.widgets().map(function(widget) {
      var col = 1;
      if (widget.position && widget.position.col) {
        col = widget.position.col;
      }
      return col + widget.width - 1;
    }));
    var totalWidth = maxCol * this.columnWidth + (maxCol + 2) * this.gutter;
    return totalWidth + 'px';
  },
  countries: function() {
    return CountryInfo.countries;
  }
});

Template.DashboardsShow.events({
  'widget:rendered': function(ev, dashTemplate, widgetTemplate) {
    var widgetNode = widgetTemplate.firstNode;
    if (dashTemplate.gridster) {
      dashTemplate.gridster.add_widget(
          widgetNode, $(widgetNode).data('sizex'), $(widgetNode).data('sizey'));
      Widgets.updatePositions(dashTemplate.gridster.serialize());
    } else {
      dashTemplate.widgetNodes.push(widgetNode);
    }
  },
  'widget:destroyed': function(ev, dashTemplate, widgetTemplate) {
    dashTemplate.removeWidget(ev.target);
  },
  'mousedown': function(ev, template) {
    // Popovers are inserted as children of body, so clicks on them never pass
    // to this template. Therefore, any click on this template that isn't
    // supposed to open a popover can safely close all popovers.
    if ($(ev.target).closest('*[data-toggle="popover"]').length === 0) {
      template.closeAllPopovers();
    }
  },
  'show.bs.popover': function(ev, template) {
    var type = $(ev.target).attr('class').match(/\bbutton-(\w+)\b/)[1];
    type = s.capitalize(type);
    var except = [this, type];
    template.closeAllPopovers(except);
  },
  'click .btn-dash-duplicate': function(ev, template) {
    var dashboard = this;

    if (Session.get('duplicating')) {
      Session.set('duplicating', false);
      template.selectionMode.off();
      template.selectionMode.selected().forEach(function(widget) {
        dashboard.addWidget(widget.copy());
      });
      template.$('.dash-btn').off('click', template.preventButtonClicks);
    } else {
      Session.set('duplicating', true);
      var selectable = _.pluck(dashboard.widgets().fetch(), '_id');
      template.selectionMode.on(selectable);
      template.$('.dash-btn:not(.btn-dash-duplicate)')
        .on('click', template.preventButtonClicks);
    }
  },
  'click .btn-dash-set-country': function(ev, template) {
    var dashboard = this;
    if (Session.get('setting-country')) {
      Session.set('setting-country', false);
      template.selectionMode.off();
      var countryCode = template.$('#set-country-country').val();
      template.selectionMode.selected().forEach(function(widget) {
        widget.setCountry(countryCode);
      });
      template.$('.dash-btn').off('click', template.preventButtonClicks);
    } else {
      Session.set('setting-country', true);
      var selectable = _.pluck(dashboard.widgetsProviding('setCountry'), '_id');
      template.selectionMode.on(selectable);
      template.$('.dash-btn:not(.btn-dash-set-country)')
        .on('click', template.preventButtonClicks);
    }
  }
});

// FIXME Move this or make it a data attr
var nodeIdToWidgetId = function(nodeId) {
  var matches = nodeId.match(/^.+-([0-9a-zA-Z]{17})-.+$/);
  return matches[1] || null;
};

var serializePositions = function($widget, position) {
  if (!position) { return; } // In case the widget doesn't exist yet
  position.id = nodeIdToWidgetId($widget.attr('id'));
  return _.pick(position, ['col', 'row', 'size_x', 'size_y', 'id']);
};

var selectionMode = {
  on: function(selectable) {
    Session.set('selecting', true);
    Session.set('selectable', selectable);
    Session.set('selected', []);
  },
  off: function() {
    Session.set('selecting', false);
    Session.set('selectable', []);
  },
  selected: function() {
    return Widgets.find({ _id: { $in: Session.get('selected') } });
  },
};

Template.DashboardsShow.onCreated(function() {
  var self = this;
  self.widgetNodes = [];
  self.selectionMode = selectionMode;
  self.onWidgetResize = {
    start: function(ev, ui, $widget) {
      $widget.trigger('gridster:resizestart', ev, ui);
    },
    resize: function(ev, ui, $widget) {
      $widget.trigger('gridster:resize', ev, ui);
    },
    stop: function(ev, ui, $widget) {
      $widget.trigger('gridster:resizestop', ev, ui);
      Widgets.updatePositions(self.gridster.serialize());
    }
  };
  self.onWidgetDrag = {
    start: function(ev, ui) {
      self.closeAllPopovers();
    },
    stop: function(ev, ui) {
      Widgets.updatePositions(self.gridster.serialize());
    }
  };
  self.closeAllPopovers = function(except) {
    var types = ['Settings', 'Info'];

    self.data.widgets().forEach(function(widget) {
      _.each(types, function(type) {
        if (except && _.isEqual(except, [widget, type])) { return; }
        Template.WidgetShow.closePopover(widget, type);
      });
    });
  };
  self.removeWidget = function(widgetNode) {
    if (self.gridster) {
      self.gridster.remove_widget(widgetNode);
    }
  };
  self.preventButtonClicks = function(e) {
    e.stopImmediatePropagation();
  };
});

Template.DashboardsShow.onRendered(function() {
  var self = this;
  var dash = self.data;

  self.gridster = self.$('#widgets').gridster({
    widget_selector: self.widgetNodes,
    widget_margins: [dash.gutter / 2, dash.gutter / 2],
    widget_base_dimensions: [dash.columnWidth, dash.rowHeight],
    serialize_params: serializePositions,
    autogrow_cols: true,
    resize: {
      enabled: true,
      start: self.onWidgetResize.start,
      stop: self.onWidgetResize.stop,
      resize: self.onWidgetResize.resize
    },
    draggable: {
      handle: '.title-bar, .title-bar *:not(a)',
      start: self.onWidgetDrag.start,
      stop: self.onWidgetDrag.stop
    }
  }).data('gridster');

  // Keep gridster up to date when other clients resize or move
  Widgets.find({ dashboardId: dash._id }).observeChanges({
    changed: function(id, fields) {
      var triggerKeys = ['width', 'height', 'position'];
      if (_.chain(fields).keys().intersection(triggerKeys).isEmpty().value()) {
        return;
      }

      var widget = Widgets.findOne(id);
      var $widgetNode = self.$('#' + widget.componentId());

      if (fields.width || fields.height) {
        self.gridster.resize_widget($widgetNode, fields.width, fields.height);
      }

      if (fields.position) {
        var oldGridData = $widgetNode.coords().grid;
        var newGridData = {
          col: fields.position.col || oldGridData.col,
          row: fields.position.row || oldGridData.row,
          size_x: oldGridData.size_x,
          size_y: oldGridData.size_y
        };
        self.gridster.mutate_widget_in_gridmap($widgetNode,
                                               oldGridData, newGridData);
      }
    }
  });
});
