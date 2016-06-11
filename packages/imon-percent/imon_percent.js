Settings = {
  icons: {
    1: 'user',
    2: 'user',
    5: 'user',
    6: 'home',
    7: 'user',
    27: 'user',
    28: 'female',
    29: 'male'
  },
  defaultData: {
    country: 'usa',
    indicatorId: 1,
    base: 100
  }
};

IMonPercentWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonPercentWidget.prototype = Object.create(Widget.prototype);
IMonPercentWidget.prototype.constructor = IMonPercentWidget;


IMonPercent = {
  widget: {
    name: 'Percentage',
    description: 'Visualizes percentage indicators.', // temp
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 3, height: 1 },
    resize: { mode: 'cover' },
    constructor: IMonPercentWidget,
    typeIcon: 'th'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
