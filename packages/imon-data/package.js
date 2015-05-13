Package.describe({
  name: 'imon-data',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.use(['html-scraper'], 'server');
  api.use(['underscore', 'mongo','aldeed:simple-schema']);

  api.addFiles(['imon-data.js']);
  api.addFiles(['server/seed.js'], 'server');

  api.export('IMonCountries');
  api.export('IMonCountry');
});
