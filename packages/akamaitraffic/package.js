Package.describe({
  name: 'akamaitraffic',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.addFiles('akamaitraffic.js');
});
