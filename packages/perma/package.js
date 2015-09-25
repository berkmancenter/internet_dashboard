Package.describe({
  name: 'perma',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['widget', 'mongo', 'momentjs:moment', 'aldeed:collection2',
           'underscore', 'remcoder:chronos', 'cfs:standard-packages',
           'cfs:gridfs']);
  api.use(['templating'], 'client');
  api.use(['http'], 'server');

  api.addFiles('perma.js');
  api.addFiles([
      'client/widget.html',
      'client/widget.js',
      'client/widget.css',
      ], 'client');
  api.addFiles(['server.js'], 'server');

  api.export('Perma');
});

Npm.depends({
  gm: '1.18.1',
});
