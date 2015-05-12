Package.describe({
  name: 'tagcloud',
  version: '0.0.1',
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('d3js:d3', 'client');
  api.imply('d3js:d3', 'client');
  api.addFiles(['d3.layout.cloud.js'], 'client');
});
