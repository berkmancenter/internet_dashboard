CountryTraffic = new Mongo.Collection('country_traffic');

Settings = {
  downloadInterval: moment.duration({ minutes: 15 }).asMilliseconds(),
  feedUrl: 'http://wwwnui.akamai.com/datavis/traffic.xml',
  limit: 10,
  map: {
    width: 450,
    height: 270,
    scale: 110,
    squash: 0.90,
    bumpDown: 30,
    bumpLeft: 30
  }
};

TrafficWidget = function(doc) { Widget.call(this, doc); };
TrafficWidget.prototype = Object.create(Widget.prototype);
TrafficWidget.prototype.constructor = TrafficWidget;

AkamaiTraffic2 = {
  widget: {
    name: 'Bytes Delivered',
    description: 'Shows which countries are above their typical averages in terms of bytes delivered by Akamai',
    url: 'http://www.akamai.com/html/technology/real-time-web-metrics.html',
    dimensions: { width: 3, height: 2 },
    category: 'access',
    constructor: TrafficWidget
  },
  org: {
    name: 'Akamai Technologies, Inc.',
    shortName: 'Akamai',
    url: 'http://www.akamai.com'
  }
};
