Package.describe({
  summary: 'd3.compose for meteor',
  version: '0.2.1'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');
  api.use('d3js:d3@3.5.8', 'client');

  api.addFiles([
  	'lib/d3.chart.js',
  	'lib/d3.compose-all.js',
  	'lib/d3.compose.css',
  	'lib/chart.js'
  	], 'client');
});
