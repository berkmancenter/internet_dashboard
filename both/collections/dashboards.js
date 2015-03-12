Dashboard = function(doc) {
  return _.extend(this, doc);
};

_.extend(Dashboard.prototype, {
  availableWidgets: function() {
    return Widgets.find({}).fetch();
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
  widgets: {
    type: [Object],
    optional: true
  },
  'widgets.$.exports': {
    type: String
  },
  'widgets.$.width': {
    type: Number,
    min: 1,
    max: 3
  },
  'widgets.$.height': {
    type: Object,
    min: 1,
    max: 3
  },
  'widgets.$.position': {
    type: Object
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
