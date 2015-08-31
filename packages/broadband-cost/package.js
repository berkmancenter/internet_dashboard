Package.describe({
  name: 'broadband-cost',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');

  api.use(['less', 'imon-data', 'underscore', 'jquery', 'widget', 'mongo',
      'aldeed:collection2', 'country-info']);
  api.use(['templating'], 'client');

  api.addFiles(['broadband_cost.js']);
  api.addFiles([
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css.less',
    ], 'client');

  api.export('BroadbandCost');
});
