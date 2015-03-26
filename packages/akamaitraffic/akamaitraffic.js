
VisitorFeed = new Mongo.Collection('visitor_feed');

Settings = {
  downloadInterval: moment.duration({ minutes: 5 }).asMilliseconds(),
  feedUrl: 'http://wwwnui.akamai.com/datavis/visitors_feed.xml'
};

TrafficWidget = function(doc) {
  Widget.call(this, doc);
  _.extend(this, {
    width: 2,
    height: 2
  });
  _.extend(this.data, {
    regionId: '0',
    regionLabel: 'The World'
  });
};
TrafficWidget.prototype = Object.create(Widget.prototype);
TrafficWidget.prototype.constructor = TrafficWidget;

AkamaiTraffic = {
  displayName: 'Akamai Traffic Monitor',
  description: 'shows global traffic information from Akamai',
  referenceUrl: 'http://www.akamai.com/html/technology/real-time-web-metrics.html',
  constructor: TrafficWidget
};
