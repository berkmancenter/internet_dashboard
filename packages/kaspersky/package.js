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
  api.addFiles(['server.js'], 'server');
});

Npm.depends({
  'xml2js': '0.4.8'
});
