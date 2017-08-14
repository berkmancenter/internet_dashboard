Settings = {
  chart: {
    padding: { right: 40, bottom: 120 },
    margins: { top: 20, bottom: 40, right: 35 },
    maxSize: 15,
    minSize: 3,
    defaultSize: 8
  },
  defaultData: {
    title: 'Bubble Chart',
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
      indicator: 'speedkbps', // Average download speed (kbps)
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
    description: 'Shows an animated bubble chart that displays three selected indicators over time.',
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 3, height: 3 },
    resize: { mode: 'cover' },
    constructor: IMonBubbleChartWidget,
    typeIcon: 'play-circle',
    indicators: 'all',
    country: 'multi',
    countries: 'all',
    settings: 'change indicators'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
