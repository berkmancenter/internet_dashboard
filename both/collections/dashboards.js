Dashboard = function(doc) {
  return _.extend(this, doc);
};

_.extend(Dashboard.prototype, {
  availableWidgets: function() {
    return Widgets.find({}).fetch();
  },
  // Separate method because it might rely on subscriptions
  initWidgets: function() {
    _.each(this.widgets, function(widget) {
      this.initWidget(widget._id);
    }, this);
  },
  subAndInitWidgets: function() {
    return _.object(_.map(this.widgets, function(widget) {
      return [widget._id, this.subAndInitWidget(widget)];
    }, this));
  },
  initWidget: function(widget) {
    var i = this.widgetIndex(widget);
    this.widgets[i] = Widgets.construct(widget, this);
  },
  initWidgetById: function(id) {
    var widget = this.widgetById(id);
    this.initWidget(widget);
  },
  widgetById: function(id) {
    return _.findWhere(this.widgets, { _id: id });
  },
  widgetIndex: function(widget) {
    return _.indexOf(this.widgets, widget);
  },
  widgetIndexById: function(id) {
    var widget = this.widgetById(id);
    return this.widgetIndex(widget);
  },
  subAndInitWidget: function(widget) {
    var self = this;
    widget.subHandles = Widgets.subHandles(widget);
    Tracker.autorun(function(comp) {
      if (Utils.Subs.allReady(widget.subHandles)) {
        self.initWidget(widget);
        comp.stop();
      }
    });
    return widget.subHandles;
  },
  subAndInitWidgetById: function(id) {
    var widget = this.widgetById(id);
    return this.subAndInitWidget(widget);
  },
  addWidget: function(widget) {
    Meteor.call('addWidgetToDashboard', this._id, widget.toJSON());
  }
});

Dashboards = new Mongo.Collection('dashboards', {
  transform: function(doc) {
    var dash = new Dashboard(doc);
    if (Meteor.isServer) {
      dash.initWidgets();
    }
    dash.widgets = _.map(dash.widgets, function(widget) {
      widget.requiredSubs = Widgets.requiredSubs(widget);
      return widget;
    });
    return dash;
  }
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
  widgets: {
    type: [Object],
    defaultValue: [],
    optional: true
  },
  'widgets.$._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'widgets.$.exports': {
    type: String
  },
  'widgets.$.fromPackage': {
    type: String
  },
  'widgets.$.width': {
    type: Number,
    min: 1,
    max: 3
  },
  'widgets.$.height': {
    type: Number,
    min: 1,
    max: 3
  },
  'widgets.$.position': {
    type: Object,
    optional: true
  },
  'widgets.$.position.x': {
    type: Number,
    min: 0
  },
  'widgets.$.position.y': {
    type: Number,
    min: 0
  },
  'widgets.$.data': {
    type: Object,
    blackbox: true
  },
  default: { 
    type: Boolean,
    defaultValue: false
  }
}));
