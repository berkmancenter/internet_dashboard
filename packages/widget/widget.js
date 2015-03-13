Widget = function(doc) {
  var defaultAttrs = {
    _id: Random.id(),
    width: 1,
    height: 1
  };

  _.extend(this, defaultAttrs, doc);
};

_.extend(Widget.prototype, {
  setData: function(doc) {
    _.extend(this.data, doc);
  },
  packageExports: function() {
    return Widgets.packageExports(this);
  },
  requiredPublications: function() {
    return this.packageExports().requiredPublications(this.data);
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

  dashboardData: function(widgetTemplate) {
    var dashboardView = widgetTemplate.view;
    while (dashboardView.name !== 'Template.DashboardsShow'
        && dashboardView.parentView) {
      dashboardView = dashboardView.parentView;
    }
    return dashboardView.templateInstance().data;
  },

  templateEvents: {
    'click .remove-widget': function(event, template) {
      var dashboard = Widgets.dashboardData(template);

      Meteor.call('removeWidgetFromDashboard', dashboard._id, this._id);
    }
  },

  construct: function(doc) {
    return new Package[doc.fromPackage][doc.exports].constructor(doc);
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
  allPublications: {
    type: [String],
    optional: true
  },
  referenceUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
}));
