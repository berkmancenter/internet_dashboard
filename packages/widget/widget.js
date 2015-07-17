Widget = function(doc) {
  doc = doc || {};
  _.extend(this, doc);

  this.data = doc.data ? new WidgetData(doc.data) : new WidgetData();
  this.data.widget = this;
};

_.extend(Widget.prototype, {
  metadata: function() {
    return WidgetTypes.findOne({ packageName: this.packageName });
  },
  toJSON: function() {
    var widget = _.pick(this, [
      '_id', 'data', 'typeId', 'dashboardId', 'height',
      'width', 'packageName', 'exportedVar'
    ]);
    widget.data = this.data.toJSON();
    return widget;
  },
  dashboard: function() {
    return Dashboards.findOne(this.dashboardId);
  },
  templateFor: function(name) {
    return this.exportedVar + name;
  },
  providesTemplate: function(name) {
    return !_.isUndefined(Template[this.templateFor(name)]);
  },
  componentId: function(component) {
    component = component || 'widget';
    console.log(this);
    return this.packageName + '-' + this._id + '-' + component;
  }
});

// Static methods
_.extend(Widget, {
  construct: function(doc) {
    var packageExports = Package[doc.packageName][doc.exportedVar];
    var widget = new packageExports.widget.constructor(doc);
    if ((_.isUndefined(widget.width) || _.isUndefined(widget.height)) && 
        packageExports.widget.dimensions) {
      widget.width = packageExports.widget.dimensions.width;
      widget.height = packageExports.widget.dimensions.height;
    }
    return widget;
  },
  Settings: {
    titleBar: { height: 20 }
  }
});

// This is the data box that widget authors can use
WidgetData = function(doc) {
  _.extend(this, doc);
};

_.extend(WidgetData.prototype, {
  set: function(doc) {
    _.extend(this, doc);
    Meteor.call(
      'updateWidgetData',
      this.widget._id,
      this.toJSON()
    );
  },
  toJSON: function() {
    return _.omit(this, [
      '_dashboard', 'widget', 'set', 'toJSON'
    ]);
  },
  isEmpty: function() {
    return _.isEmpty(_.omit(this, ['widget'].concat(_.functions(this))));
  }
});

// Collection
Widgets = new Mongo.Collection('widgets', {
  transform: function(doc) { return Widget.construct(doc); }
});

Widgets.attachSchema(new SimpleSchema({
  typeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  packageName: {
    type: String,
  },
  exportedVar: {
    type: String
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
  Meteor.call('updateWidgetPositions', positions);
};
