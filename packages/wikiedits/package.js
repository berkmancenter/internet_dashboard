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
  api.use(['widget', 'mongo', 'tracker', 'underscore', 'momentjs:moment',
      'country-info', 'wiki-data']);
  api.use(['templating', 'epoch', 'jquery', 'd3js:d3'], 'client');
  api.addFiles('wikiedit-stream.js');
  api.addFiles('server.js', 'server');
  api.addFiles([
    'client/info.html',
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css'
    ], 'client');
  api.export('WikiStream');
});

Npm.depends({ wikichanges: 'https://github.com/jdcc/wikichanges/tarball/f2a70d12df72c3e97669c712a1b60a10201e117b' });
