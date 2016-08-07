Settings = {
  chart: {
    padding: { right: 40, bottom: 80 },
    margins: { top: 30, bottom: 0, right: 35 },
  },
  defaultData: {
    title: 'Bar Chart',
    mode: 'single', // other mode: 'multi', refers to the number of indicators.
    byYear: false,
    chosenYear: '',
    sorted: false, // sort by value. When false, the x-axis is sorted by name instead.
    x: {
      single: {
        indicator: ["isr", "ita", "mex", "mar", "kor", "gbr", "usa"]
      },
      multi: {
        indicator: ['downloadkbps', 'speedkbps'] // Average download speed, % of people using the internet. temp.
      }
    },
    y: {
      single: {
        indicator: 'ipr' // % of people using the internet
      },
      multi: {
        indicator: 'kor' // temp
      }
    }
  }
};

IMonBarchartWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonBarchartWidget.prototype = Object.create(Widget.prototype);
IMonBarchartWidget.prototype.constructor = IMonBarchartWidget;

IMonBarchart = {
  widget: {
    name: 'Bar Chart',
    description: 'Shows a bar chart comparing an indicator across several countries.',
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 3, height: 2 },
    resize: { mode: 'cover' },
    constructor: IMonBarchartWidget,
    typeIcon: 'bar-chart',
    indicators: 'all',
    country: 'multi',
    countries: 'all'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};

