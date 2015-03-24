AkamaiTraffic = {
  displayName: 'Akamai Traffic Monitor',
  description: 'shows global traffic information from Akamai',
  referenceUrl: 'http://www.akamai.com/html/technology/real-time-web-metrics.html',
  constructor: TrafficWidget
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

  //http://www.akamai.com/esi/get_it.xml?env=wwwnui&path=/datavis/visitors_feed.xml
  //http://wwwnui.akamai.com/datavis/visitors_feed.xml
