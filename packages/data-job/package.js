Package.describe({
  name: 'data-job',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use([
      'underscore',
      'percolate:synced-cron',
      'momentjs:moment'
  ], 'server');
  api.addFiles([
      'server.js'
  ], 'server');
  api.export('DataJob', 'server');
  api.export('DataJobs', 'server');
});
