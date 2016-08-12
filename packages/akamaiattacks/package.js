Package.describe({
  name: 'akamaiattacks',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['mongo', 'momentjs:moment', 'underscore', 'aldeed:collection2',
      'country-info', 'widget']);
  api.use(['http'], 'server');
  api.use(['templating', 'epoch', 'd3js:d3'], 'client');

  api.addFiles('akamaiattacks.js');
  api.addFiles(['server.js'], 'server');
  api.addFiles([
    'client/lib/d3.geo.js',
    'client/lib/d3-legend.js',
    'client/info.html',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css'
    ], 'client');

  api.export('AkamaiAttacks');
  api.export('CountryAttacks');
});

Npm.depends({
  'xml2js': '0.4.6'
});
