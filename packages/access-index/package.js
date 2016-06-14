Package.describe({
  name: 'access-index',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['widget', 'less@2.6.0', 'underscore', 'imon-data', 'country-info']);
  api.use(['templating'], 'client');

  api.addFiles(['access-index.js']);

  api.addFiles([
    'client/info.html',
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css.less',
  ], 'client');

  api.export('AccessIndex');
});
