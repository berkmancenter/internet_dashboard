Settings = {
  icons: { // hash of indicator IDs : icons for when it's not 'user' / person.
    6: 'home',
    28: 'female',
    29: 'male'
  },
  defaultData: {
    country: 'usa',
    indicatorId: 1,
    base: 100,
    form: 'percent' // other: 'fraction'
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
    dimensions: { width: 2, height: 2 },
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
