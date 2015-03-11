Widget = function(doc) {
  _.extend(this, doc);
};

Widgets = new Mongo.Collection('widgets', {
  transform: function(doc) { return new Widget(doc); }
});

Widgets.attachSchema(new SimpleSchema({
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
  displayName: {
    type: String
  },
  position: {
    type: Object
  },
  'position.x': {
    type: Number,
    min: 0
  },
  'position.y': {
    type: Number,
    min: 0
  }
}));
