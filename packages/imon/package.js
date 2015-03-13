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
  api.use(['http'], 'server');
  api.use(['underscore', 'jquery', 'widget', 'mongo','aldeed:simple-schema']);
  api.use(['templating'], 'client');

  api.addFiles(['imon.js']);

  api.addFiles(['server/imon.js'], 'server');

  api.addFiles([
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js'], 'client');

  api.export('IMon');
});

Npm.depends({
  jquery: '2.1.3',
  jsdom: '3.1.2'
});
