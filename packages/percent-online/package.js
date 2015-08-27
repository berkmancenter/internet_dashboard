Package.describe({
  name: 'percent-online',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');

  api.use(['imon-data', 'underscore', 'jquery', 'widget', 'mongo',
      'country-info', 'aldeed:simple-schema']);
  api.use(['templating', 'fortawesome:fontawesome@4.3.0'], 'client');

  api.addFiles(['percent_online.js']);
  api.addFiles([
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    ], 'client');

  api.export('PercentOnline');
});
