Package.describe({
  name: 'herdict',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['underscore', 'mongo']);
  api.use(['http', 'widget'], 'server');

  api.addFiles(['herdict.js','countries.js']);
  api.addFiles('server.js', 'server');
});

Npm.depends({
  jquery: '2.1.3',
  jsdom: '3.1.2',
});
