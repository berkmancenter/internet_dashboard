define(['backbone', 'jquery', 'underscore', 'app/widget', 'imon/view', 'imon/setting_view'],
  function(Backbone, $, _, Widget, IMonView, IMonSettingView) {
    return Widget.extend({
      defaults: function() {
        return _.extend(Widget.prototype.defaults(), {
          displayName: 'Internet Monitor',
          width: 2,
          height: 1,
          country: 'usa',
          category: 'access',
          indicator: { name: 'Percentage of individuals using the Internet' },
          proxy: true,
          view: IMonView,
          settingsView: IMonSettingView,
          source: 'http://thenetmonitor.org/',
          saveFields: ['country', 'category', 'indicator']
        });
      },

      initialize: function() {
        this.on('change:country', this.onCountryChange);
        this.on('change:indicator', this.onIndicatorChange);
        Widget.prototype.initialize.apply(this, arguments);
      },

      dataSourceUrl: function() {
        return 'http://thenetmonitor.org/countries/' + this.get('country') + '/' + this.get('category');
      },

      sync: function(method, model, options) {
        if (method === 'read') {
          options.dataType = 'html';
        }
        return Backbone.sync.apply(this, [method, model, options]);
      },

      onCountryChange: function() {
        this.fetch();
      },

      onIndicatorChange: function() {
        var indicator = this.findThisIndicator(this.get('data').indicators);
        if (indicator) {
          this.set('indicator', indicator);
        }
      },

      findThisIndicator: function(data) {
        var indicatorName = this.get('indicator').name,
            indicator = _.find(data, function(i) { return i.name === indicatorName; });
        if (indicator) {
          return indicator;
        }
      },

      parse: function(response) {
        var output = { data: { indicators: [] } };
        output.data.countryName = $('.country-name', response).text();
        output.data.allCountries = $('.countries-nav-list a', response).map(function() {
          var r = new RegExp('/countries/([a-z]{3})/');
          return { code: r.exec($(this).attr('href'))[1], name: $(this).text() };
        }).get();
        $('.indicators dt > span > a', response).each(function() {
          output.data.indicators.push({
            name: $(this).text(),
            value: $(this).parent().parent().next().find('.indicator-bar-inner').data('value')
          });
        });
        var indicator = this.findThisIndicator(output.data.indicators);
        if (indicator) {
          output.indicator = indicator;
        }
        return output;
      }
    });
  }
);
