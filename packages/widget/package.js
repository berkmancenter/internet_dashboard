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

  api.use(['underscore', 'less', 'mongo', 'aldeed:simple-schema']);
  api.use(['templating'], 'client');

  api.addFiles(['widget.js', 'methods.js', 'widget_types.js']);
  api.addFiles([
    'server/publications.js',
    'server/seeds.js'], 'server');
  api.addFiles([
    'client/widget.html',
    'client/widget.js',
    'client/widget.css.less',
    'client/settings.js'], 'client');

  api.export('Widget');
  api.export('Widgets');
  api.export('WidgetTypes');
});
