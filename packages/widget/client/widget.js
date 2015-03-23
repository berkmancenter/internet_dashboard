Template.WidgetShow.helpers({
  widgetTemplate: function() {
    return Widgets.templateFor(this, 'Widget');
  },
  settingsTemplate: function() {
    return Widgets.templateFor(this, 'Settings');
  },
  infoTemplate: function() {
    return Widgets.templateFor(this, 'Info');
  },
  providesInfo: function() {
    return Widgets.providesTemplate(this, 'Info');
  },
  providesSettings: function() {
    return Widgets.providesTemplate(this, 'Settings');
  },
  widgetId: function(aspect) {
    aspect = aspect || 'widget';
    return this.fromPackage + '-' + this._id + '-' + aspect;
  },
  widgetClass: function() {
    return this.fromPackage;
  }
});

Template.WidgetShow.onRendered(function() {
  var dashboardTemplate = Widgets.dashboardTemplate(this);
  var widgetNode = this.firstNode;
  var widgetData = $(widgetNode).data();

  /*
  dashboardTemplate.gridster.add_widget(
    widgetNode, widgetData.sizex, widgetData.sizey
  );
  */
});

Template.WidgetShow.events({
  'click .remove-widget': function(ev, template) {
    var dashboardTemplate = Dashboards.templateFromChild(template);
    var dashboard = dashboardTemplate.data;

    dashboardTemplate.gridster.remove_widget(template.firstNode);

    Widgets.updatePositions(
      dashboardTemplate.data,
      dashboardTemplate.gridster.serialize()
    );

    dashboard.removeWidget(this);
  },
});

Template.registerHelper('widgetLoading', function() {
  return 'Loading...';
});
