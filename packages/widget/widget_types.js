WidgetTypes = new Mongo.Collection('widget_types');

WidgetTypes.attachSchema(new SimpleSchema({
  packageName: {
    type: String
  },
  exportedVar: {
    type: String
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
    type: Object
  },
  'widget.dimensions.width': {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5]
  },
  'widget.dimensions.height': {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5]
  },
  'widget.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  'widget.resize': {
    type: Object
  },
  'widget.resize.mode': {
    type: String,
    defaultValue: 'scale',
    allowedValues: ['scale', 'reflow']
  },
  'widget.resize.constraints': {
    type: Object
  },
  'widget.resize.constraints.width': {
    type: Object
  },
  'widget.resize.constraints.width.min': {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5],
    defaultValue: 1
  },
  'widget.resize.constraints.width.max': {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5],
    defaultValue: 5
  },
  'widget.resize.constraints.height': {
    type: Object
  },
  'widget.resize.constraints.height.min': {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5],
    defaultValue: 1
  },
  'widget.resize.constraints.height.max': {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5],
    defaultValue: 5
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
