Settings = {
  chart: {
    padding: { right: 40, bottom: 100 },
    margins: { top: 30, bottom: 0, right: 35 },
    dots: {
      size: 5,
      color: '#378E00',
      opacity: 0.7
    }
  },
  defaultData: {
    title: 'Scatter Plot',
    byYear: false,
    chosenYear: '',
    x: {
      indicator: 'ipr', // Percentage of individuals using the Internet
      log: false,
      jitter: 0.0
    },
    y: {
      indicator: 'downloadkbps', // Average download speed (kbps)
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
    name: 'Scatterplot',
    description: 'Shows a scatterplot of two chosen metrics from the Internet Monitor dataset across all countries',
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 3, height: 2 },
    resize: { mode: 'cover' },
    constructor: IMonScatterWidget,
    typeIcon: 'line-chart'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
