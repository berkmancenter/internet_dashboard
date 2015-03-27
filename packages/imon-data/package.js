Package.describe({
  name: 'imon-data',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.use(['http'], 'server');
  api.use(['underscore', 'mongo','aldeed:simple-schema']);

  api.addFiles(['imon-data.js']);
  api.addFiles(['server/seed.js'], 'server');

  api.export('IMonCountries');
  api.export('IMonCountry');
});

Npm.depends({
  jquery: '2.1.3',
  jsdom: '3.1.2',
  socks: '1.1.7'
});
