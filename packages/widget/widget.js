Widget = function(doc) {
  doc = doc || {};
  _.extend(this, doc);

  this.data = doc.data ? new WidgetData(doc.data) : new WidgetData();
  this.data.widget = this;
  
  this.package = WidgetPackages.findOne({ packageName: this.packageName });
};

_.extend(Widget.prototype, {
  toJSON: function() {
    var widget = _.pick(this, [
      '_id', 'packageName', 'dashboardId', 'height', 'width', 'position', 'data'
    ]);
    widget.data = this.data.toJSON();
    return widget;
  },
  dashboard: function() {
    return Dashboards.findOne(this.dashboardId);
  },
  componentId: function(component) {
    component = component || 'widget';
    return this.packageName + '-' + this._id + '-' + component;
  }
});

// Static methods
_.extend(Widget, {
  construct: function(doc) {
    var package = WidgetPackages.findOne({ packageName: doc.packageName });
    var widgetInfo = Package[package.packageName][package.exportedVar].widget;
    var widget = new widgetInfo.constructor(doc);

    if ((_.isUndefined(widget.width) || _.isUndefined(widget.height)) && 
        widgetInfo.dimensions) {
      widget.width = widgetInfo.dimensions.width;
      widget.height = widgetInfo.dimensions.height;
    }
    return widget;
  },
  Settings: {
    titleBar: { height: 20 }
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
  'position.x': {
    type: Number,
    min: 0
  },
  'position.y': {
    type: Number,
    min: 0
  },
  data: {
    type: Object,
    blackbox: true
  }
}));

Widgets.updatePositions = function(positions) {
  if (Dashboards.findOne().editable()) {
    Meteor.call('updateWidgetPositions', positions);
  }
};
