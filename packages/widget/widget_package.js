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
  },
  category: function() {
    var slug = this.metadata().widget.category;
    if (!slug) { return; }
    return _.findWhere(Widget.Settings.categories, { slug: slug.toLowerCase() });
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

// Remove all widgets that use this package if the package gets removed
WidgetPackages.find().observe({
  removed: function(removedPackage) {
    Widgets.remove({ packageName: removedPackage.packageName });
  }
});
