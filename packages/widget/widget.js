Widget = function(doc) {
  var defaultAttrs = {
    _id: Random.id(),
    width: 1,
    height: 1
  };

  _.extend(this, defaultAttrs, doc);
};

_.extend(Widget.prototype, {
  setData: function(doc) {
    _.extend(this.data, doc);
  },
});

Widgets = new Mongo.Collection('widgets', {
  transform: function(doc) { return new Widget(doc); }
});

Widgets.templateHelpers = {
  template: function(name) {
    return this.exports + name;
  },
  widgetTemplate: function() {
    return Widgets.templateHelpers.template.call(this, 'Widget');
  },
  settingsTemplate: function() {
    return Widgets.templateHelpers.template.call(this, 'Settings');
  },
  infoTemplate: function() {
    return Widgets.templateHelpers.template.call(this, 'Info');
  },
  providesTemplate: function(name) {
    return !_.isUndefined(Template[this.exports + name]);
  },
  providesInfo: function() {
    return Widgets.templateHelpers.providesTemplate.call(this, 'Info');
  },
  providesSettings: function() {
    return Widgets.templateHelpers.providesTemplate.call(this, 'Settings');
  }
};

Widgets.widgetTemplateEvents = {
  'click .remove-widget': function(event, template) {
    console.log('remove');
  }
};

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
    optional: true
  },
  publications: {
    type: [String],
    optional: true
  },
  referenceUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
}));
