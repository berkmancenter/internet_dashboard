Package.describe({
  name: 'feed',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['widget', 'less', 'underscore', 'momentjs:moment', 'aldeed:collection2']);
  api.use(['templating'], 'client');

  api.addFiles(['feed.js']);
  api.addFiles(['server.js'], 'server');

  api.addFiles([
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css.less',
    ], 'client');

  api.export('Feed');
});

Npm.depends({
  feedparser: '1.1.3',
  request: '2.61.0'
});
