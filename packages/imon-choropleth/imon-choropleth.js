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
    description: 'Thematic map of the world in which areas are shaded in proportion to the ' +
      'measurement of a statistical variable chosen from the Internet Monitor Data Aggregation Service',
    url: 'https://thenetmonitor.org/sources',
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
