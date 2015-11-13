Package.describe({
  name: 'change-org',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['mongo', 'underscore', 'aldeed:collection2', 'country-info', 'widget']);
  api.use(['http'], 'server');
  api.use(['templating', 'epoch', 'd3js:d3'], 'client');

  api.addFiles('change.js');
  api.addFiles(['server.js'], 'server');
  api.addFiles([
    'client/lib/d3.geo.js',
    'client/info.html',
    'client/widget.html',
    'client/widget.js',
    ], 'client');

  api.export('ChangeOrg');
});

Npm.depends({
  'pubnub': '3.7.15'
});
