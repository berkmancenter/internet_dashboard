Settings = {
  chart: {
    padding: { right: 40, bottom: 80 },
    margins: { top: 30, bottom: 0, right: 35 },
    dotSize: 5
  },
  defaultData: {
    title: 'Scatter Plot',
    x: {
      indicator: 'Percentage of individuals using the Internet',
      log: false,
      jitter: 0.0
    },
    y: {
      indicator: 'Percentage of individuals using the Internet',
      log: false,
      jitter: 0.0
    }
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
    dimensions: { width: 3, height: 2 },
    resize: { mode: 'cover' },
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
