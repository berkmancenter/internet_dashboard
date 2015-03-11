define(['app/about_view', 'underscore', 'text!blank/templates/about.html'],
  function(AboutView, _, templateContents) {
    return AboutView.extend({
      template: _.template(templateContents),
      events: {
        'click .save-settings': 'onSave'
      },
      onSave: function(e) {
        this.close();
      }
    });
  }
);
