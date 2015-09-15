Package.describe({
  name: 'herdict',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['underscore', 'mongo', 'aldeed:collection2', 'widget', 'country-info']);
  api.use(['html-scraper', 'momentjs:moment'], 'server');
  api.use(['templating'], 'client');

  api.addFiles(['herdict.js']);
  api.addFiles('server.js', 'server');
  api.addFiles([
    'client/info.html',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    'client/settings.html',
    'client/settings.js'
  ], 'client');

  api.export('Herdict');
});
