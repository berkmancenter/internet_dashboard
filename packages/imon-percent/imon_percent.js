Settings = {
  icons: { // hash of indicator IDs : icons for when it's not 'user' / person.
    hhnet: 'home',
    edf: 'female',
    edm: 'male'
  },
  defaultData: {
    country: 'usa',
    indicatorName: 'bbrate',
    color: '#6192BD'
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
    resize: { mode: 'cover', constraints: { height: { min: 2 } } },
    constructor: IMonPercentWidget,
    typeIcon: 'th'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
