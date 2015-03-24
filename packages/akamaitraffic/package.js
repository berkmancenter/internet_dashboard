Package.describe({
  name: 'akamaitraffic',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.use(['mongo', 'widget', 'momentjs:moment', 'underscore', 'aldeed:simple-schema']);
  api.use(['http'], 'server');
  api.use(['templating', 'pfafman:epoch'], 'client');

  api.addFiles('akamaitraffic.js');
  api.addFiles(['server.js'], 'server');
  api.addFiles([
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    ], 'client');

  api.export('AkamaiTraffic');
});

Npm.depends({
  'xml2js': '0.4.6'
});
