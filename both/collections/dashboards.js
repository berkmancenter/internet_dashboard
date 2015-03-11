Dashboard = function(doc) {
  return _.extend(this, doc);
};

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
    type: Object,
    blackbox: true
  },
  default: { 
    type: Boolean,
    defaultValue: false
  }
}));
