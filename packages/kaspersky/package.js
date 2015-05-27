Package.describe({
  name: 'kaspersky',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['widget', 'mongo', 'momentjs:moment', 'aldeed:simple-schema', 'underscore']);
  api.use(['templating', 'epoch'], 'client');
  api.use(['http'], 'server');

  api.addFiles('kaspersky.js');
  api.addFiles([
      'client/widget.html',
      'client/widget.js',
      'client/widget.css'
      ], 'client');
  api.addFiles(['server.js'], 'server');

  api.export('Kaspersky');
});

Npm.depends({
  'xml2js': '0.4.8'
});
