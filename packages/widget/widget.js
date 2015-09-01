Widget = function(doc) {
  doc = doc || {};
  _.extend(this, doc);

  this.data = doc.data ? new WidgetData(doc.data) : new WidgetData();
  this.data.widget = this;

  this.package = WidgetPackages.findOne({ packageName: this.packageName });
};

_.extend(Widget.prototype, {
  toJSON: function() {
    var widget = Widgets.simpleSchema().clean(_.clone(this));
    widget.data = this.data.toJSON();
    return widget;
  },
  dashboard: function() {
    return Dashboards.findOne(this.dashboardId);
  },
  componentId: function(component) {
    component = component || 'widget';
    return this.packageName + '-' + this._id + '-' + component;
  },
  set: function(attrs) {
    Meteor.call('updateWidget', this._id, attrs);
  },
  pixelDims: function(gridDims) {
    var dashboard = this.dashboard();
    var currentDims = { width: this.width, height: this.height };
    gridDims = _.clone(gridDims) || currentDims;
    _.defaults(gridDims, currentDims);
    return {
      width: gridDims.width * dashboard.columnWidth +
        dashboard.gutter * (gridDims.width - 1),
      height: gridDims.height * dashboard.rowHeight +
        dashboard.gutter * (gridDims.height - 1)
    };
  },
  copy: function() {
    return Widget.construct(_.omit(this.toJSON(), ['_id']));
  },
  setCountry: function() {},
  category: function() {
    return this.package.category();
  }
});

// Static methods
_.extend(Widget, {
  construct: function(doc) {
    var package = WidgetPackages.findOne({ packageName: doc.packageName });
    var widgetInfo = Package[package.packageName][package.exportedVar].widget;

    if ((_.isUndefined(doc.width) || _.isUndefined(doc.height)) &&
        widgetInfo.dimensions) {
      doc.width = widgetInfo.dimensions.width;
      doc.height = widgetInfo.dimensions.height;
    }

    if (_.isUndefined(doc.resize) && widgetInfo.resize) {
      doc.resize = widgetInfo.resize;
    }

    doc = Widgets.simpleSchema().clean(doc);
    return new widgetInfo.constructor(doc);
  },
  Settings: {
    titleBar: { height: 20 },
    categories: [
      {
        slug: 'access',
        name: 'Access/Infrastructure',
        color: '#F15C23'
      },
      {
        slug: 'control',
        name: 'Control',
        color: '#5EC1A5'
      },
      {
        slug: 'activity',
        name: 'Activity',
        color: '#AAA04E'
      }
    ]
  }
});

// Collection
Widgets = new Mongo.Collection('widgets', {
  transform: function(doc) { return Widget.construct(doc); }
});

Widgets.attachSchema(new SimpleSchema({
  packageName: {
    type: String,
  },
  dashboardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  width: {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5],
  },
  height: {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5],
  },
  position: {
    type: Object,
    optional: true
  },
  'position.row': {
    type: Number,
    min: 0
  },
  'position.col': {
    type: Number,
    min: 0
  },
  'resize': {
    type: Object,
    optional: true
  },
  'resize.mode': {
    type: String,
    defaultValue: 'scale',
    optional: true,
    allowedValues: ['scale', 'reflow']
  },
  'resize.constraints': {
    type: Object,
    optional: true,
  },
  'resize.constraints.width': {
    type: Object,
    optional: true,
  },
  'resize.constraints.width.min': {
    type: Number,
    defaultValue: 1,
    allowedValues: [1, 2, 3, 4, 5],
    optional: true,
  },
  'resize.constraints.width.max': {
    type: Number,
    defaultValue: 5,
    allowedValues: [1, 2, 3, 4, 5],
    optional: true,
  },
  'resize.constraints.height': {
    type: Object,
    optional: true,
  },
  'resize.constraints.height.min': {
    type: Number,
    defaultValue: 1,
    allowedValues: [1, 2, 3, 4, 5],
    optional: true,
  },
  'resize.constraints.height.max': {
    type: Number,
    defaultValue: 5,
    allowedValues: [1, 2, 3, 4, 5],
    optional: true,
  },
  data: {
    type: Object,
    blackbox: true
  }
}));

Widgets.updatePositions = function(positions) {
  Meteor.call('updateWidgetPositions', positions);
};
