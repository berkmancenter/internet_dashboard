define(['backbone', 'jquery', 'underscore', 'app/widget', 'blank/view', 'blank/setting_view', 'blank/about_view'],
  function(Backbone, $, _, Widget, BlankView, BlankSettingView, BlankAboutView) {
    return Widget.extend({
      defaults: function() {
        return _.extend(Widget.prototype.defaults(), {
          displayName: 'Blank',
          view: BlankView,
          settingsView: BlankSettingView,
          aboutView: BlankAboutView,
          source: 'http://example.com/'
        });
      },

      initialize: function() {
        Widget.prototype.initialize.apply(this, arguments);
      },

      dataSourceUrl: function() {
        return 'http://example.com/';
      },

      sync: function(method, model, options) {
        if (method === 'read') {
          options.dataType = 'html';
        }
        return Backbone.sync.apply(this, [method, model, options]);
      },

      parse: function(response) {
        return {};
      }
    });
  }
);
