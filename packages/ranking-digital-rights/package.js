Package.describe({
  name: 'ranking-digital-rights',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['widget', 'mongo', 'aldeed:collection2', 'underscore',
           'underscorestring:underscore.string']);
  api.use(['templating', 'd3js:d3'], 'client');

  api.addFiles('rdr.js');
  api.addFiles([
      'client/info.html',
      'client/widget.html',
      'client/widget.js',
      'client/widget.css',
      'client/settings.html',
      'client/settings.js'
      ], 'client');
  api.addFiles(['server.js'], 'server');
  api.addFiles('rdr_index.csv', 'server', { isAsset: true });

  api.export('RDR');
});

Npm.depends({
  'csv-parse': '1.0.1'
});
