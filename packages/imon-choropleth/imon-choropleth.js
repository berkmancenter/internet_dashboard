Settings = {
  map: {
    width: 450,
    height: 270,
    scale: 110,
    squash: 0.90,
    bumpDown: 30,
    bumpLeft: 30
  }
};

ImonChoroplethWidget = function(doc) { Widget.call(this, doc); };
ImonChoroplethWidget.prototype = Object.create(Widget.prototype);
ImonChoroplethWidget.prototype.constructor = ImonChoroplethWidget;

ImonChoropleth = {
  widget: {
    name: 'Global Choropleth Map',
    description: 'Shows a global chloropleth map of individual indicators within the Internet Monitor Access Index.',
    url: 'https://thenetmonitor.org/sources/platform-data',
    dimensions: { width: 3, height: 2 },
    category: 'access',
    typeIcon: 'globe',
    constructor: ImonChoroplethWidget,
    displays: 'countryData'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};