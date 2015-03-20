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
  requiredSubs: function() {
    return this.packageExports().requiredSubs(this.data.toJSON());
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
  templateFor: function(widget, name) {
    return widget.exports + name;
  },
  providesTemplate: function(widget, name) {
    return !_.isUndefined(Template[Widgets.templateFor(widget, name)]);
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

  construct: function(doc, dashboard) {
    var widget = new Package[doc.fromPackage][doc.exports].constructor(doc);
    widget.dashboard = dashboard;
    widget.data = new WidgetData(dashboard, widget, widget.data);
    return widget;
  },

  packageExports: function(doc) {
    return Package[doc.fromPackage][doc.exports];
  },

  requiredSubs: function(doc) {
    return Widgets.packageExports(doc).requiredSubs(doc);
  },

  subHandles: function(doc) {
    return _.map(Widgets.requiredSubs(doc), function(pub) {
      return Meteor.subscribe(pub, doc.data);
    });
  },
  updatePositions: function(dashboard, positions) {
    Meteor.call(
      'updateDashboardWidgetPositions',
      dashboard._id,
      positions
    );
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
