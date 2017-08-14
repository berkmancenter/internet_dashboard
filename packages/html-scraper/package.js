Package.describe({
  name: 'html-scraper',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(['http', 'underscore'], 'server');

  api.addFiles('html-scraper.js', 'server');

  api.export('HTMLScraper', 'server');
});

Npm.depends({
  jquery: '2.2.4',
  jsdom: '9.11.0',
  socks: '1.1.10'
});
