Package.describe({
  name: 'wiki-data',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.use(['mongo', 'underscore'], 'server');
  api.addFiles('wiki-data.js', 'server');
  api.export('WikiEdits');
  api.export('Wikipedias');
});

Npm.depends({ wikichanges: 'https://github.com/jdcc/wikichanges/tarball/f2a70d12df72c3e97669c712a1b60a10201e117b' });
