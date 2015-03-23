WidgetTypes = new Mongo.Collection('widget_types');

WidgetTypes.attachSchema(new SimpleSchema({
  packageName: {
    type: String
  },
  exportedVar: {
    type: String
  },
  displayName: {
    type: String
  },
  description: {
    type: String,
    optional: true
  },
  referenceUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
}));
