Package.describe({
  name: 'google-trends-map',
  version: '0.0.1',
  summary: '',
});
//

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');
  api.use(['imon-data']);
  api.use(['mongo', 'widget', 'momentjs:moment', 'underscore',
           'country-info', 'aldeed:collection2']);
  api.use(['http'], 'server');
  api.use(['templating', 'epoch', 'd3js:d3'], 'client');
  api.addFiles('google-trends-map.js');
  api.addFiles(['server.js'], 'server');
  api.addFiles([
    'client/lib/d3.geo.js',
    'client/info.html',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    'client/settings.html',
    'client/settings.js'
    ], 'client');
  api.export('GoogleTrendsMap');
});

Npm.depends({ 'request': '2.76.0' });
