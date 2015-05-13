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
  jquery: '2.1.3',
  jsdom: '3.1.2',
  socks: '1.1.7'
});
