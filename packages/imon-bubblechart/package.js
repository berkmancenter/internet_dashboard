Package.describe({
  name: 'imon-bubblechart',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['imon-data', 'underscore', 'widget']);
  api.use(['templating', 'd3compose'], 'client');

  api.addFiles(['imon_bubblechart.js']);
  api.addFiles(['server/methods.js'], 'server');
  api.addFiles([
    'client/info.html',
    'client/settings.html',
    'client/settings.js',
    'client/settings.css',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    ], 'client');

  api.export('IMonBubbleChart');
});
