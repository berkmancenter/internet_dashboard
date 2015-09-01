Package.describe({
  name: 'widget',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');

  api.use(['underscore', 'less', 'mongo', 'aldeed:collection2', 'iron:router',
      'aramk:tinycolor'
  ]);
  api.use(['templating'], 'client');

  api.addFiles([
    'widget.js',
    'methods.js',
    'widget_package.js',
    'widget_data.js',
    'routes.js'
  ]);
  api.addFiles([
    'server/publications.js',
    'server/seeds.js'], 'server');
  api.addFiles([
    'client/common.js',
    'client/widget.html',
    'client/settings.html',
    'client/info.html',
    'client/embed.html',
    'client/widget.js',
    'client/settings.js',
    'client/info.js',
    'client/embed.js',
    'client/widget.css.less',
  ], 'client');

  api.export('Widget');
  api.export('Widgets');
  api.export('WidgetPackage');
  api.export('WidgetPackages');
});

Npm.depends({
  'flatten-obj': '2.0.1'
});
