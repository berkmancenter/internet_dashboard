Package.describe({
  name: 'imon-timeline',
  version: '0.0.1',
  summary: '',
  git: ''
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use(['widget', 'underscore', 'momentjs:moment', 'imon-data', 'country-info']);
  api.use(['templating', 'd3compose', 'fortawesome:fontawesome'], 'client');

  api.addFiles('imon_timeline.js');
  api.addFiles([
    'client/info.html',
    'client/settings.css',
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css'
  ], 'client');

  api.export('IMonTimeline');
});
