var Future = Npm.require('fibers/future');

HTMLScraper = {
  inDoc: function(url, func, options) {
    //console.log('Fetching: ' + url);
    options = options || {};
    _.defaults(options, {
      proxy: false,
      proxyHost: '127.0.0.1',
      proxyPort: 2020,
      proxyType: 5,
      timeout: 30 * 1000,
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

    var future = Future.wrap(HTTP.get)(url, callOptions);
    var result;
    try {
      result = future.wait();
    } catch (error) {
      console.error('HTMLScraper: Error fetching ' + url);
      console.error(error);
      throw new Error(error);
    }

    var env = Npm.require('jsdom').env;
    env(result.content, Meteor.bindEnvironment(function(error, window) {
      var $ = Npm.require('jquery')(window);
      func.call(this, $);
    }));
  }.future()
};
