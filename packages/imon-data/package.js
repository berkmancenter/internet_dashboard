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
  api.use(['http', 'meteorhacks:aggregate@1.3.0'], 'server');
  api.use(['underscore', 'mongo', 'aldeed:collection2']);

  api.addFiles(['imon-data.js']);
  api.addFiles(['client.js'], 'client');
  api.addFiles(['server/seed.js', 'server/publications.js'], 'server');

  api.export('IMonIndicators');
  api.export('IMonCountries');
  api.export('IMonData');
  api.export('IMonDev');
  api.export('IMonCountriesDev');
  api.export('IMonIndicatorsDev');
});

Npm.depends({ 'jsonapi-datastore': '0.3.2-beta' });
