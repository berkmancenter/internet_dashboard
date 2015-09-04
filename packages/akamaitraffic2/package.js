Package.describe({
  name: 'akamaitraffic2',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.use(['mongo', 'widget', 'momentjs:moment', 'underscore',
      'country-info', 'aldeed:collection2']);
  api.use(['http'], 'server');
  api.use(['templating', 'epoch', 'd3js:d3'], 'client');

  api.addFiles('akamaitraffic2.js');
  api.addFiles(['server.js'], 'server');
  api.addFiles([
    'client/lib/d3.geo.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    ], 'client');

  api.export('AkamaiTraffic2');
});

Npm.depends({
  'xml2js': '0.4.6'
});
