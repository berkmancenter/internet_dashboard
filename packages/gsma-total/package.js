Package.describe({
  name: 'gsma-total',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['widget', 'underscore', 'country-info', 'momentjs:moment', 'gsma-data']);
  api.use(['templating', 'epoch'], 'client');

  api.addFiles('gsma.js');
  api.addFiles([
    'client/info.html',
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css'
  ], 'client');

  api.export('GSMATotal');
});
