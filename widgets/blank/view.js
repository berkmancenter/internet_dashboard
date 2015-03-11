define(['app/widget_view', 'underscore', 'text!blank/templates/view.html'],
  function(WidgetView, _, templateContents) {
    return WidgetView.extend({
      viewName: 'blank',
      template: _.template(templateContents),
      initialize: function() {
        // If you're going to initialize, make sure to call the parent
        WidgetView.prototype.initialize.apply(this, arguments);
      }
    });
  }
);
