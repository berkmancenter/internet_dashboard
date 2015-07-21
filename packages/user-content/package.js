Package.describe({
  name: 'user-content',
  version: '0.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['widget', 'mongo', 'underscore']);
  api.use(['templating', 'claviska:jquery-minicolors'], 'client');

  api.addFiles(['user-content.js']);
  api.addFiles([
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    'client/settings.html',
    'client/settings.js',
    'client/settings.css'
  ], 'client');

  api.export('UserContent');
});
