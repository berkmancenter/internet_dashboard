Package.describe({
  name: 'herdict',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['underscore', 'mongo', 'aldeed:collection2', 'widget']);
  api.use(['html-scraper'], 'server');
  api.use(['templating'], 'client');

  api.addFiles(['herdict.js','countries.js']);
  api.addFiles('server.js', 'server');
  api.addFiles([
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    'client/settings.html',
    'client/settings.js'
  ], 'client');

  api.export('Herdict');
});
