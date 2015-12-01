Package.describe({
  name: 'gsma-data',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['mongo', 'underscore', 'momentjs:moment', 'aldeed:collection2']);
  api.use(['http', 'country-info'], 'server');

  api.addFiles('apiKey.txt', 'server', { isAsset: true });
  api.addFiles('gsma.js');
  api.addFiles(['server.js'], 'server');
  api.export('GSMAData');
});
