Package.describe({
  name: 'lumen',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['widget', 'mongo', 'underscore', 'momentjs:moment', 'aldeed:collection2']);
  api.use(['templating', 'epoch'], 'client');
  api.use(['http'], 'server');

  api.addFiles('authToken.txt', 'server', { isAsset: true });
  api.addFiles('lumen.js');
  api.addFiles(['server.js'], 'server');
  api.addFiles([
    'client/widget.html',
    'client/widget.js',
    'client/widget.css'
  ], 'client');

  api.export('Lumen');
});
