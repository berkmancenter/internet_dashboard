Package.describe({
  name: 'choropleth-map',
  version: '0.0.1',
  summary: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.use(['country-info', 'underscore']);
  api.use(['d3js:d3'], 'client');
  api.addFiles([
    'client/lib/d3-legend.js',
    'client/lib/d3.geo.js',
    'client/choropleth-map.js'
    ], 'client');
  api.export('ChoroplethMap');
});
