WidgetPackage = function(doc) {
  doc = doc || {};
  _.extend(this, doc);
};

_.extend(WidgetPackage.prototype, {
  metadata: function() {
    return this;
  },
  templateFor: function(name) {
    return this.exportedVar + name;
  },
  providesTemplate: function(name) {
    return !_.isUndefined(Template[this.templateFor(name)]);
  },
});

WidgetPackages = new Mongo.Collection('widget_packages', {
  transform: function(doc) { return new WidgetPackage(doc); }
});

WidgetPackages.attachSchema(new SimpleSchema({
  packageName: {
    type: String,
    index: true,
    unique: true
  },
  exportedVar: {
    type: String
  },
  sortPosition: {
    type: Number
  },
  widget: {
    type: Object
  },
  'widget.name': {
    type: String
  },
  'widget.description': {
    type: String,
    optional: true
  },
  'widget.dimensions': {
    type: Object,
    optional: true
  },
  'widget.dimensions.width': {
    type: Number,
    defaultValue: 2,
    allowedValues: [1, 2, 3, 4, 5]
  },
  'widget.dimensions.height': {
    type: Number,
    defaultValue: 1,
    allowedValues: [1, 2, 3, 4, 5]
  },
  'widget.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  'widget.resize': {
    type: Object,
    optional: true
  },
  'widget.resize.mode': {
    type: String,
    defaultValue: 'scale',
    optional: true,
    allowedValues: ['scale', 'reflow']
  },
  'widget.resize.constraints': {
    type: Object,
    optional: true,
  },
  'widget.resize.constraints.width': {
    type: Object,
    optional: true,
  },
  'widget.resize.constraints.width.min': {
    type: Number,
    defaultValue: 1,
    allowedValues: [1, 2, 3, 4, 5],
    optional: true,
  },
  'widget.resize.constraints.width.max': {
    type: Number,
    defaultValue: 5,
    allowedValues: [1, 2, 3, 4, 5],
    optional: true,
  },
  'widget.resize.constraints.height': {
    type: Object,
    optional: true,
  },
  'widget.resize.constraints.height.min': {
    type: Number,
    defaultValue: 1,
    allowedValues: [1, 2, 3, 4, 5],
    optional: true,
  },
  'widget.resize.constraints.height.max': {
    type: Number,
    defaultValue: 5,
    allowedValues: [1, 2, 3, 4, 5],
    optional: true,
  },
  org: {
    type: Object,
    optional: true
  },
  'org.name': {
    type: String
  },
  'org.shortName': {
    type: String
  },
  'org.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  }
}));
