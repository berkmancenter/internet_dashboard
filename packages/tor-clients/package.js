Package.describe({
  name: 'tor-clients',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['harrison:babyparse', 'http', 'meteorhacks:aggregate@1.3.0'], 'server');
  api.use([
      'widget', 'mongo', 'underscore',
      'momentjs:moment@2.9.0', 'aldeed:collection2', 'country-info'
  ]);
  api.use(['templating', 'epoch'], 'client');

  api.addFiles('tor_clients.js');
  api.addFiles('server.js', 'server');
  api.addFiles([
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    'client/settings.html',
    'client/settings.js',
    'client/info.html',
    'client/info.js',
    'client/info.css',
    ], 'client');

  api.export('TorClients');
  api.export('TorCountries');
});
