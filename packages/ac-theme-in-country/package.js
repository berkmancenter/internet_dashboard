Package.describe({
  name: 'ac-theme-in-country',
  version: '0.0.1',
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.3.1');

  api.use(['widget', 'mongo', 'underscore', 'tmeasday:check-npm-versions',
      'country-info', 'react-meteor-data', 'ecmascript', 'fourseven:scss',
      'react-template-helper']);

  api.use(['accesscheck-data'], 'server');
  api.use(['templating'], 'client');

  api.addFiles(['theme-in-country.js']);
  api.addFiles([
      'client/widget.html',
      'client/widget.jsx',
      'client/widget.scss',
      'client/settings.html',
      'client/settings.js',
  ], 'client');

  api.export('ThemeInCountry');
});
