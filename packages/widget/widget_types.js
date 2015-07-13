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
  'widget.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url
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
