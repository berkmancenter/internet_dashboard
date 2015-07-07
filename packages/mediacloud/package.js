Package.describe({
  name: 'mediacloud',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');

  api.use(['http'], 'server');
  api.use(['widget', 'mongo', 'underscore', 'momentjs:moment']);
  api.use(['templating', 'tagcloud'], 'client');

  api.addFiles([
    'data/emm_countries.js',
    'data/gv_countries.js',
    'mediacloud.js',
  ]);

  api.addFiles('apiKey.txt', 'server', { isAsset: true });
  api.addFiles(['server.js'], 'server');

  api.addFiles([
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    'client/settings.html',
    'client/settings.js'
    ], 'client');

  api.export('MediaCloud');
});
