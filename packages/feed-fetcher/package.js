Package.describe({
  name: 'feed-fetcher',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['widget', 'underscore', 'momentjs:moment', 'aldeed:collection2',
      'vsivsi:job-collection']);
  api.use([
      'http',
      'underscorestring:underscore.string',
  ], 'server');

  api.addFiles(['feed_fetcher.js']);
  api.addFiles(['server.js'], 'server');

  api.export('FeedItems');
});

Npm.depends({
  feedparser: '1.1.3'
});

