Package.describe({
  name: 'sub-counter',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['sha', 'underscore', 'aldeed:collection2', 'random',
           'meteorhacks:aggregate'], 'server');

  api.addFiles('sub_counter.js', 'server');
  api.export('SubCounter', 'server');
});
