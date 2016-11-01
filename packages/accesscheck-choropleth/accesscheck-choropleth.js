Settings = {
  defaultData: {
    url: 'http://google.com'
  },
  colors: { // they have to remain in this order for the legend to be accurate
    up: '#6192BD',
    down: '#C0392B'
  },
  map: {
    width: 500,
    height: 220,
    scale: 90,
    squash: 1,
    bumpDown: 30,
    bumpLeft: 30
  }
};

AccessCheckChoroplethWidget = function(doc) { 
  Widget.call(this, doc); 
  _.defaults(this.data, Settings.defaultData);
};
AccessCheckChoroplethWidget.prototype = Object.create(Widget.prototype);
AccessCheckChoroplethWidget.prototype.constructor = AccessCheckChoroplethWidget;

AccessCheckChoropleth = {
  widget: {
    name: 'Link Availibility Choropleth Map',
    description: 'Shows a global choropleth map of the availibility status (up, down) for a given link.',
    url: 'https://accesscheck.thenetmonitor.org/',
    dimensions: { width: 3, height: 2 },
    typeIcon: 'globe',
    constructor: AccessCheckChoroplethWidget,
    displays: 'countryData',
    country: 'multi',
    countries: 'all',
    settings: 'change URL'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
