CountryTraffic = new Mongo.Collection('country_traffic');

Settings = {
  downloadInterval: moment.duration({ minutes: 15 }).asMilliseconds(),
  feedUrl: 'http://wwwnui.akamai.com/datavis/traffic.xml',
  limit: 10
};

TrafficWidget = function(doc) {
  Widget.call(this, doc);
  _.extend(this, {
    width: 2,
    height: 2
  });
};
TrafficWidget.prototype = Object.create(Widget.prototype);
TrafficWidget.prototype.constructor = TrafficWidget;

AkamaiTraffic2 = {
  displayName: 'Akamai Traffic Monitor 2',
  description: 'Shows country-level traffic information from Akamai',
  referenceUrl: 'http://www.akamai.com/html/technology/real-time-web-metrics.html',
  constructor: TrafficWidget
};

