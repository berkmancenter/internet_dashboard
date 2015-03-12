Package.describe({
  name: 'imon',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.use(['underscore', 'widget', 'mongo']);
  api.use(['aldeed:simple-schema'], 'server');
  api.use(['templating'], 'client');
  api.addFiles([
    'server/imon.js',
    'imon.js'], 'server');

  api.addFiles([
    'client/settings.html',
    'client/settings.js',
    'client/widget.html'], 'client');

  api.export('IMon', 'server');
});

Npm.depends({ request: '2.53.0' });
Npm.require('request');
