Settings = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  defaultData: {
   country: 'usa',
   indicatorName: 'hhnet'
 }
};

IMonValuetrendWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonValuetrendWidget.prototype = Object.create(Widget.prototype);
IMonValuetrendWidget.prototype.constructor = IMonValuetrendWidget;


IMonValuetrend = {
  widget: {
    name: 'Value-Trend',
    description: 'Shows value of an indicator for a specific country and its trend over time.',
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 3, height: 1 },
    constructor: IMonValuetrendWidget,
    typeIcon: 'line-chart',
    resize: { mode: 'cover', constraints: { height: { max: 1 } } }
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
