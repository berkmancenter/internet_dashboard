Dashboard = function(doc) {
  return _.extend(this, doc);
};

_.extend(Dashboard.prototype, {
  addWidget: function(widget) {
    widget.dashboard = this;

    // Because widget templates only see the data bit
    widget.data._dashboard = this;
    Meteor.call('addWidgetToDashboard', this._id, widget.toJSON());
  },
  removeWidget: function(widget) {
    Meteor.call('removeWidgetFromDashboard', dashboard._id, this._id);
  }
});

Dashboards = new Mongo.Collection('dashboards', {
  transform: function(doc) { return new Dashboard(doc); }
});

Dashboards.attachSchema(new SimpleSchema({
  columnWidth: {
    type: Number,
    defaultValue: 150
  },
  rowHeight: {
    type: Number,
    defaultValue: 150,
  },
  gutter: {
    type: Number,
    defaultValue: 20
  },
  default: { 
    type: Boolean,
    defaultValue: false
  }
}));

Dashboards.templateFromChild = function(template) {
  var dashboardView = template.view;
  while (dashboardView.name !== 'Template.DashboardsShow'
      && dashboardView.parentView) {
    dashboardView = dashboardView.parentView;
  }
  return dashboardView.templateInstance();
};

Dashboards.dataFromChild: function(template) {
  return Dashboards.templateFromChild(template).data;
},
