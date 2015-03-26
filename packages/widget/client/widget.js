Template.WidgetShow.helpers({
  widgetTemplate: function() {
    return Widget.templateFor(this, 'Widget');
  },
  settingsTemplate: function() {
    return Widget.templateFor(this, 'Settings');
  },
  infoTemplate: function() {
    return Widget.templateFor(this, 'Info');
  },
  providesInfo: function() {
    return Widget.providesTemplate(this, 'Info');
  },
  providesSettings: function() {
    return Widget.providesTemplate(this, 'Settings');
  },
  widgetId: function(aspect) {
    aspect = aspect || 'widget';
    return this.packageName + '-' + this._id + '-' + aspect;
  },
  widgetClass: function() {
    return this.packageName;
  }
});

Template.WidgetShow.onRendered(function() {
  var dashboardTemplate = Dashboards.templateFromChild(this);
  var widgetNode = this.firstNode;
  var widgetData = $(widgetNode).data();

  if (dashboardTemplate.gridster) {
    dashboardTemplate.gridster.add_widget(
      widgetNode, widgetData.sizex, widgetData.sizey
    );
    Widgets.updatePositions(dashboardTemplate.gridster.serialize());
  } else {
    dashboardTemplate.widgetNodes.push(widgetNode);
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
});

Template.registerHelper('widgetLoading', function() {
  return 'Loading...';
});
