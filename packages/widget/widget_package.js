WidgetPackage = function(doc) {
  doc = doc || {};
  _.extend(this, doc);
};

_.extend(WidgetPackage.prototype, {
  templateFor: function(name) {
    return this.exportedVar + name;
  },
  providesTemplate: function(name) {
    return !_.isUndefined(Template[this.templateFor(name)]);
  },
  metadata: function() {
    return Package[this.packageName][this.exportedVar];
  }
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
  }
}));
