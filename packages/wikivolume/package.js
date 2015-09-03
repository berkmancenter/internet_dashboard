Package.describe({
  name: 'wikivolume',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['meteorhacks:aggregate@1.3.0', 'random'], 'server');
  api.use([
      'widget', 'mongo', 'tracker', 'underscore', 'country-info',
      'momentjs:moment', 'wiki-data', 'aldeed:collection2'
  ]);
  api.use(['templating', 'epoch', 'jquery'], 'client');

  api.addFiles('wikiedits.js');
  api.addFiles('server.js', 'server');
  api.addFiles([
    'client/widget.html', 'client/widget.js', 'client/widget.css',
    'client/settings.html', 'client/settings.js'
    ], 'client');
  api.export('WikiEditCounts');
});

Npm.depends({
  wikichanges: 'https://github.com/jdcc/wikichanges/tarball/f2a70d12df72c3e97669c712a1b60a10201e117b'
});
