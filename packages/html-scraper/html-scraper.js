HTMLScraper = {
  inDoc: function(url, func, options) {
    console.log('Fetching: ' + url);
    options = options || {};
    _.defaults(options, {
      proxy: false,
      proxyHost: '127.0.0.1',
      proxyPort: 2020,
      proxyType: 5
    });

    var callOptions = {};

    if (options.proxy) {
      console.log('Proxying');
      var Socks = Npm.require('socks');
      var socksAgent = new Socks.Agent({
        proxy: {
          ipaddress: options.proxyHost,
          port: options.proxyPort,
          type: options.proxyType,
        }},
        true,
        false
        );
      callOptions.npmRequestOptions = { agent: socksAgent };
    }

    HTTP.get(url, callOptions, function (error, result) {
      if (error) {
        throw new Error(error);
      }

      if (!error && result.statusCode === 200) {
        var env = Npm.require('jsdom').env;
        env(result.content, Meteor.bindEnvironment(function(error, window) {
          var $ = Npm.require('jquery')(window);
          func.call(this, $);
        }));
      }
    });
  }
};
