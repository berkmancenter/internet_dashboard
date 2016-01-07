Package.describe({
  name: 'imon-scatter',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['imon-data', 'underscore', 'widget']);
  api.use(['templating', 'd3js:d3@3.5.8'], 'client');

  api.addFiles(['imon_scatter.js']);
  api.addFiles([
    'client/lib/d3.chart.js',
    'client/lib/d3.compose-all.js',
    'client/lib/chart.js',
    'client/lib/d3.compose.css',
    'client/info.html',
    'client/settings.html',
    'client/settings.js',
    'client/settings.css',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    ], 'client');

  api.export('IMonScatter');
});
