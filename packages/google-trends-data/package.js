Package.describe({
  name: 'google-trends-data',
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
      'underscorestring:underscore.string',
  ], 'server');

  api.addFiles(['google_trends_data.js']);
  api.addFiles(['server.js'], 'server');

  api.export('GoogleTrendsItems');
});

