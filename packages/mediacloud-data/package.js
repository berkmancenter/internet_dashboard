Package.describe({
  name: 'mediacloud-data',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['http'], 'server');
  api.use(['widget', 'mongo', 'underscore', 'momentjs:moment',
    'aldeed:collection2', 'vsivsi:job-collection'
  ]);

  api.addFiles([
    'data/emm_countries.js',
    'data/gv_countries.js',
    'mediacloud_data.js'
  ]);

  api.addFiles('apiKey.txt', 'server', { isAsset: true });
  api.addFiles([
      'server.js',
      'stories_server.js',
      'word_list_server.js'
  ], 'server');

  api.export('WordLists');
  api.export('Stories');
  api.export('EMMCountries');
  api.export('GVCountries');
});
