VisitorFeed = new Mongo.Collection('visitor_feed');

Settings = {
  downloadInterval: moment.duration({ minutes: 5 }).asMilliseconds(),
  feedUrl: 'http://wwwnui.akamai.com/datavis/visitors_feed.xml',
  regions: [
    //{ code: '0', name: 'The World'     , machineName: '' },
    { code: '1', name: 'North America' , machineName: 'northAmerica' },
    { code: '2', name: 'South America' , machineName: 'southAmerica' },
    { code: '3', name: 'Europe'        , machineName: 'europe' },
    { code: '4', name: 'Asia (Pacific)', machineName: 'asia' },
    { code: '5', name: 'Africa'        , machineName: 'africa' },
    { code: '6', name: 'Australia'     , machineName: 'oceania' }
  ]             ,
  funnelHeight: 64
};

TrafficWidget = function(doc) {
  Widget.call(this, doc);
};
TrafficWidget.prototype = Object.create(Widget.prototype);
TrafficWidget.prototype.constructor = TrafficWidget;

AkamaiTraffic = {
  widget: {
    name: 'Web Requests',
    description: 'Shows the number of HTTP hits per second the Akamai network receives from each continent',
    url: 'http://www.akamai.com/html/technology/real-time-web-metrics.html',
    dimensions: { width: 3, height: 1 },
    category: 'access',
    typeIcon: 'area-chart',
    constructor: TrafficWidget
  },
  org: {
    name: 'Akamai Technologies, Inc.',
    shortName: 'Akamai',
    url: 'http://www.akamai.com'
  }
};
