Widget = function(doc) {
  _.extend(this, doc);
};

Widgets = new Mongo.Collection('widgets', {
  transform: function(doc) { return new Widget(doc); }
});

Widgets.attachSchema(new SimpleSchema({
  fromPackage: {
    type: String
  },
  exports: {
    type: String
  },
  displayName: {
    type: String
  },
  description: {
    type: String,
  },
  referenceUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
}));
