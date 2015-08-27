Package.describe({
  name: 'country-info',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles('country_info.js');
  api.addFiles(['methods.js'], 'server');
  api.export('CountryInfo');
});

Npm.depends({ 'country-data': '0.0.22' });
