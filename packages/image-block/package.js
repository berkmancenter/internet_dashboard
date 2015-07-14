Package.describe({
  name: 'image-block',
  version: '0.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['widget', 'mongo', 'underscore']);
  api.use(['templating'], 'client');

  api.addFiles(['image-block.js']);
  api.addFiles([
    'client/widget.html',
    'client/widget.css',
    'client/settings.html',
    'client/settings.js',
    'client/settings.css'
  ], 'client');

  api.export('ImageBlock');
});
