define(['app/setting_view', 'underscore', 'text!blank/templates/settings.html'],
  function(SettingView, _, templateContents) {
    return SettingView.extend({
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
