GoogleTrends = new Mongo.Collection('google_trends');
//

Settings = {
  defaultData: {
    keyword: 'node.js'
  },
  suffix: {
    percentage: '%',
    speed: 'kbps'
  },
  map: {
    width: 450,
    height: 270,
    scale: 110,
    squash: 0.90,
    bumpDown: 30,
    bumpLeft: 30
  }
};

GoogleTrendsMapWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};
GoogleTrendsMapWidget.prototype = Object.create(Widget.prototype);
GoogleTrendsMapWidget.prototype.constructor = GoogleTrendsMapWidget;

GoogleTrendsMap = {
  widget: {
    name: 'Google Trends Map',
    description: 'Search term prevalence across countries.',
    url: 'https://thenetmonitor.org/sources/platform-data',
    dimensions: { width: 3, height: 2},
    typeIcon: 'globe',
    constructor: GoogleTrendsMapWidget,
    displays: 'countryData',
    settings: 'change keyword'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
