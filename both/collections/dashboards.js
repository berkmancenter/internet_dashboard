Dashboard = function(doc) {
  return _.extend(this, doc);
};

_.extend(Dashboard.prototype, {
  addWidget: function(widget) {
    widget.dashboardId = this._id;
    Meteor.call('addWidgetToDashboard', widget.toJSON());
  },
  removeWidget: function(widget) {
    Meteor.call('removeWidgetFromDashboard', widget._id);
  },
  widgets: function() {
    return Widgets.find({ dashboardId: this._id });
  },
  widgetsProviding: function(functionName) {
    return _.filter(this.widgets().fetch(), function(widget) {
      return _.has(Object.getPrototypeOf(widget), functionName);
    });
  },
  isOwned: function() {
    return !!this.ownerId;
  },
  iAmOwner: function() {
    return Meteor.user() && this.isOwned() && this.ownedBy(Meteor.user());
  },
  ownedBy: function(user) {
    return !!user && user._id === this.ownerId;
  },
  editable: function() {
    return this.editableBy(Meteor.user());
  },
  editableBy: function(user) {
    return this.publiclyEditable || (!!user && _.contains(this.editorIds, user._id));
  },
  authorize: function() {
    if (!this.editableBy(Meteor.user())) {
      throw new Meteor.Error('not-owner',
          'Must be the current owner of the dashboard to edit.');
    } else {
      return true;
    }
  }
});

Dashboards = new Mongo.Collection('dashboards', {
  transform: function(doc) { return new Dashboard(doc); }
});

Dashboards.attachSchema(new SimpleSchema({
  title: {
    type: String,
    max: 255,
    optional: true
  },
  columnWidth: {
    type: Number,
    defaultValue: 150
  },
  rowHeight: {
    type: Number,
    defaultValue: 170,
  },
  gutter: {
    type: Number,
    defaultValue: 20
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  editorIds: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  publiclyEditable: {
    type: Boolean,
    defaultValue: true
  }
}));

Dashboards.templateFromChild = function(template) {
  var dashboardView = template.view;
  while (dashboardView.name !== 'Template.DashboardsShow' &&
      dashboardView.parentView) {
    dashboardView = dashboardView.parentView;
  }
  return dashboardView.templateInstance();
};

Dashboards.dataFromChild = function(template) {
  return Dashboards.templateFromChild(template).data;
};
