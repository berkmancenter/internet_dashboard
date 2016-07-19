Settings = {
  chart: {
    padding: { right: 40, bottom: 120 },
    margins: { top: 20, bottom: 20, right: 35 },
    maxSize: 15,
    minSize: 3,
    defaultSize: 8
  },
  defaultData: {
    title: 'Bubble Chart',
    countries: 'all',
    z: { // Size of bubble
      same: false, // Bubbles are all of the same size?
      indicator: 'bbrate' // Broadband Adoption (%)
    },
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

IMonBubbleChartWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonBubbleChartWidget.prototype = Object.create(Widget.prototype);
IMonBubbleChartWidget.prototype.constructor = IMonBubbleChartWidget;

IMonBubbleChart = {
  widget: {
    name: 'Bubble Chart',
    description: 'Shows an animated bubble chart of multi-dimensions of data.',
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 3, height: 2 },
    resize: { mode: 'cover' },
    constructor: IMonBubbleChartWidget,
    typeIcon: 'play-circle'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
