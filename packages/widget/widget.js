Widget = function(doc) {
  _.extend(this, doc);

  this.data = new WidgetData(doc.data);
  this.data.widget = this;
};

_.extend(Widget.prototype, {
  packageExports: function() {
    return Widgets.packageExports(this);
  },
  requiredSubs: function() {
    return this.packageExports().requiredSubs(this.data.toJSON());
  },
  toJSON: function() {
    var widget = _.pick(this, [
      '_id', 'data', 'typeId', 'dashboardId', 'height', 'width'
    ]);
    widget.data = widget.data.toJSON();
    return widget;
  }
});

Widgets = new Mongo.Collection('widgets', {
  transform: function(doc) { return Widget.construct(doc); }
});

Widgets.attachSchema(new SimpleSchema({
  typeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  dashboardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  width: {
    type: Number,
    min: 1,
    max: 3,
    defaultValue: 1
  },
  height: {
    type: Number,
    min: 1,
    max: 3,
    defaultValue: 1
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

Widgets.updatePositions = function(dashboard, positions) {
  Meteor.call(
    'updateWidgetPositions',
    dashboard._id,
    positions
  );
}


// This is the data box that widget authors can use
WidgetData = function(doc) {
  _.extend(this, doc);
};

_.extend(WidgetData.prototype, {
  set: function(doc) {
    _.extend(this, doc);
    Meteor.call(
      'updateDashboardWidgetData',
      this._dashboard._id,
      this.widget._id,
      this.toJSON()
    );
  },
  toJSON: function() {
    return _.omit(this, [
      '_dashboard', 'widget', 'setData', 'toJSON'
    ]);
  }
});



// Static methods
_.extend(Widget, {
  construct: function(doc, dashboard) {
    return new Package[doc.fromPackage][doc.exports].constructor(doc);
  },

  templateFor: function(widget, name) {
    return widget.exports + name;
  },
  providesTemplate: function(widget, name) {
    return !_.isUndefined(Template[Widgets.templateFor(widget, name)]);
  },


});
