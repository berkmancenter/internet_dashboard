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
  },
  widgetData: function() {
    this.data._dashboard = this.dashboard;
    this.data.widget = this;
    return this.data;
  },
  ready: function() {
    return false;
  }
});

Template.WidgetShow.onCreated(function() {
  var self = this;
  _.each(self.data.requiredSubs, function(sub) {
    self.subscribe(sub, self.data.data);
  });
});

Template.WidgetShow.onRendered(function() {
  var self = this;
  var dashboardTemplate = Widgets.dashboardTemplate(this);

  this.autorun(function(comp) {
    if (self.subscriptionsReady()) {
      var widgetNode = self.firstNode;
      var widgetData = $(widgetNode).data();

      dashboardTemplate.gridster.add_widget(
        widgetNode, widgetData.sizex, widgetData.sizey,
        widgetData.col, widgetData.row
      );
      comp.stop();

      // Gridster exists if we already rendered the dashboard
      // FIXME This needs to check to make sure a widget is being added
      /*
      if (dashboardTemplate.gridster) {
        dashboardTemplate.gridster.add_widget(
          widgetNode, widgetData.sizex, widgetData.sizey
        );
        Widgets.updatePositions(
          dashboardTemplate.data,
          dashboardTemplate.gridster.serialize()
        );
      }
      */
    }
  });
});

Template.WidgetShow.events({
  'click .remove-widget': function(ev, template) {
    var dashboard = Widgets.dashboardData(template);
    var dashboardTemplate = Widgets.dashboardTemplate(template);

    dashboardTemplate.gridster.remove_widget(template.firstNode);
    Widgets.updatePositions(
      dashboardTemplate.data,
      dashboardTemplate.gridster.serialize()
    );

    Meteor.call('removeWidgetFromDashboard', dashboard._id, this._id);
  },
});

Template.registerHelper('widgetLoading', function() {
  return 'Loading...';
});
