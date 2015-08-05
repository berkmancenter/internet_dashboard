// This is the data bucket that widget authors can use
WidgetData = function(doc) {
  _.extend(this, doc);
};

_.extend(WidgetData.prototype, {
  set: function(doc) {
    _.extend(this, doc);
    if (Dashboards.findOne().editable()) {
      Meteor.call( 'updateWidgetData', this.widget._id, this.toJSON());
    }
  },
  toJSON: function() {
    return _.omit(this, [ '_dashboard', 'widget', 'set', 'toJSON' ]);
  },
  isEmpty: function() {
    var functionNames = ['widget'].concat(_.functions(this));
    var withoutFunctions = _.omit(this, functionNames);
    return _.isEmpty(withoutFunctions);
  }
});

