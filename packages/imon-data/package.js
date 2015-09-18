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
  api.use(['html-scraper', 'meteorhacks:aggregate'], 'server');
  api.use(['underscore', 'mongo', 'aldeed:collection2']);

  api.addFiles(['imon-data.js']);
  api.addFiles(['client.js'], 'client');
  api.addFiles(['server/seed.js'], 'server');

  api.export('IMonCountryData');
  api.export('IMonCountries');
});
