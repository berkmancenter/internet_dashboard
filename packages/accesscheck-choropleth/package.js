Package.describe({
  name: 'accesscheck-choropleth',
  version: '0.0.1',
  summary: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.use(['accesscheck-data']);
  api.use(['mongo', 'widget', 'underscore',
           'choropleth-map']);
  api.use(['templating'], 'client');
  api.addFiles('accesscheck-choropleth.js');
  api.addFiles([
    'client/lib/d3.geo.js',
    'client/info.html',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    'client/settings.html',
    'client/settings.js'
    ], 'client');
  api.export('AccessCheckChoropleth');
});
