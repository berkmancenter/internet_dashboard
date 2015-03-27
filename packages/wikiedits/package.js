Package.describe({
  name: 'wikiedits',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.use(['meteorhacks:aggregate@1.2.1', 'random'], 'server');
  api.use(['widget', 'mongo', 'tracker', 'underscore', 'momentjs:moment']);
  api.use(['templating', 'pfafman:epoch', 'jquery'], 'client');
  api.addFiles('wikiedits.js');
  api.addFiles('server.js', 'server');
  api.addFiles([
    'client/widget.html', 'client/widget.js', 'client/widget.css',
    'client/settings.html', 'client/settings.js'
    ], 'client');
  api.export('WikiEdits');
});

Npm.depends({ wikichanges: 'https://github.com/jdcc/wikichanges/tarball/f2a70d12df72c3e97669c712a1b60a10201e117b' });
