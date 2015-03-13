Dashboard = function(doc) {
  return _.extend(this, doc);
};

_.extend(Dashboard.prototype, {
  availableWidgets: function() {
    return Widgets.find({}).fetch();
  },
  // Separate method because it might rely on subscriptions
  initWidgets: function() {
    this.widgets = _.map(this.widgets, Widgets.construct);
  },
  subHandles: function() {
    return _.flatten(_.map(this.widgets, function(widget) {
      return _.map(Widgets.requiredPublications(widget), function(pub) {
        return Meteor.subscribe(pub);
      });
    }));
  }
});

Dashboards = new Mongo.Collection('dashboards', {
  transform: function(doc) {
    var dash = new Dashboard(doc);
    if (Meteor.isServer) {
      dash.initWidgets();
    }
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
