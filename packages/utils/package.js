Package.describe({
  name: 'utils',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.1');
  api.use('underscore');
  api.addFiles('subutils.js');
  api.export('Utils');
});
