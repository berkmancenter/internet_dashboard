Package.describe({
  summary: 'Epoch charts packaged for Meteor',
  version: "0.8.4",
});

Package.on_use(function (api) {
  api.versionsFrom("1.1.0.2");
  api.use('d3js:d3', 'client');

  api.add_files('lib/epoch.js', 'client');
  api.add_files('lib/epoch.css', 'client');
  api.add_files('lib/custom.css', 'client');
});
