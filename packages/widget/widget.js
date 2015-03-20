Widget = function(doc) {
  var defaultAttrs = {
    _id: Random.id(),
    width: 1,
    height: 1
  };

  _.extend(this, defaultAttrs, doc);
};

_.extend(Widget.prototype, {
  packageExports: function() {
    return Widgets.packageExports(this);
  },
  requiredPublications: function() {
    return this.packageExports().requiredPublications(this.data.toJSON());
  },
  toJSON: function() {
    var widget = _.pick(this, [
      '_id', 'data', 'exports', 'fromPackage', 'height', 'width'
    ]);
    widget.data = widget.data.toJSON();
    return widget;
  }
});



// This is the data box that widget authors can use
WidgetData = function(dashboard, widget, doc) {
  if (_.isUndefined(dashboard)) {
    throw new Error('WidgetData needs a dashboard, but was given: ' + dashboard);
  }

  if (_.isUndefined(widget)) {
    throw new Error('WidgetData needs a widget, but was given: ' + widget);
  }

  this._dashboard = dashboard;
  this.widget = widget;
  _.extend(this, doc);
};

_.extend(WidgetData.prototype, {
  setData: function(doc) {
    _.extend(this, doc);
    Meteor.call(
      'updateDashboardWidgetData',
      this._dashboard._id,
      this.widget._id,
      this.toJSON()
    );
  },
  toJSON: function() {
    return _.omit(this, [
      '_dashboard', 'widget', 'setData', 'toJSON'
      ]);
  }
});



Widgets = new Mongo.Collection('widgets', {
  transform: function(doc) { return new Widget(doc); }
});

_.extend(Widgets, {
  templateHelpers: {
    template: function(name) {
      return this.exports + name;
    },
    widgetTemplate: function() {
      return Widgets.templateHelpers.template.call(this, 'Widget');
    },
    settingsTemplate: function() {
      return Widgets.templateHelpers.template.call(this, 'Settings');
    },
    infoTemplate: function() {
      return Widgets.templateHelpers.template.call(this, 'Info');
    },
    providesTemplate: function(name) {
      return !_.isUndefined(Template[this.exports + name]);
    },
    providesInfo: function() {
      return Widgets.templateHelpers.providesTemplate.call(this, 'Info');
    },
    providesSettings: function() {
      return Widgets.templateHelpers.providesTemplate.call(this, 'Settings');
    }
  },

  dashboardTemplate: function(widgetTemplate) {
    var dashboardView = widgetTemplate.view;
    while (dashboardView.name !== 'Template.DashboardsShow'
        && dashboardView.parentView) {
      dashboardView = dashboardView.parentView;
    }
    return dashboardView.templateInstance();
  },

  dashboardData: function(widgetTemplate) {
    return Widgets.dashboardTemplate(widgetTemplate).data;
  },

  templateEvents: {
    'click .remove-widget': function(event, template) {
      var dashboard = Widgets.dashboardData(template);

      Meteor.call('removeWidgetFromDashboard', dashboard._id, this._id);
    }
  },

  construct: function(doc, dashboard) {
    var widget = new Package[doc.fromPackage][doc.exports].constructor(doc);
    widget.dashboard = dashboard;
    widget.data = new WidgetData(dashboard, widget, widget.data);
    return widget;
  },

  packageExports: function(doc) {
    return Package[doc.fromPackage][doc.exports];
  },

  requiredPublications: function(doc) {
    return Widgets.packageExports(doc).requiredPublications(doc);
  }
});

Widgets.attachSchema(new SimpleSchema({
  fromPackage: {
    type: String
  },
  exports: {
    type: String
  },
  displayName: {
    type: String
  },
  description: {
    type: String,
    optional: true
  },
  referenceUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
}));
