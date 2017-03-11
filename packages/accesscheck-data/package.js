Package.describe({
  name: 'accesscheck-data',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.use(['http'], 'server');
  api.use(['aldeed:collection2-core', 'ecmascript']);

  api.addFiles(['accesscheck-data.js']);
  api.addFiles(['server/methods.js'], 'server');
});

