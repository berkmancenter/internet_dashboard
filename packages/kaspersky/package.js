Package.describe({
  name: 'kaspersky',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['widget', 'mongo', 'momentjs:moment', 'aldeed:collection2',
      'country-info', 'similar-string', 'underscore']);
  api.use(['templating', 'epoch'], 'client');
  api.use(['http'], 'server');

  api.addFiles('kaspersky.js');
  api.addFiles([
      'client/info.html',
      'client/widget.html',
      'client/widget.js',
      'client/widget.css',
      'client/settings.html',
      'client/settings.js'
      ], 'client');
  api.addFiles(['server.js'], 'server');

  api.export('Kaspersky');
  api.export('CountryMetrics');
});

Npm.depends({
  'xml2js': '0.4.8'
});
