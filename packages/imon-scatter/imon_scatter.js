Settings = {
  defaultData: {
    x: { indicator: 'Percentage of individuals using the Internet' },
    y: { indicator: 'Percentage of individuals using the Internet' }
  }
};

IMonScatterWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonScatterWidget.prototype = Object.create(Widget.prototype);
IMonScatterWidget.prototype.constructor = IMonScatterWidget;

IMonScatter = {
  widget: {
    name: 'Scatter Plot',
    description: 'Shows a scatter plot',
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 2, height: 2 },
    resize: { mode: 'reflow' },
    constructor: IMonScatterWidget,
    typeIcon: 'line-chart',
    category: 'access'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
