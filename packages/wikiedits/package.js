Package.describe({
  name: 'wikiedits',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.use(['momentjs:moment'], 'server');
  api.use(['widget', 'mongo', 'tracker']);
  api.use(['templating', 'pfafman:epoch', 'jquery'], 'client');
  api.addFiles('wikiedits.js');
  api.addFiles('server.js', 'server');
  api.addFiles(['client/widget.html', 'client/widget.js'], 'client');
  api.export('WikiEdits');
});

Npm.depends({ wikichanges: '0.2.7' });
