Settings = {
  gaugeWidth: 146, // per unit width
  defaultData: {
    country: 'usa',
    indicatorId: 3, // Average connection speed (kbps)
    color: '#6192BD'
 }
};

IMonSpeedometerWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonSpeedometerWidget.prototype = Object.create(Widget.prototype);
IMonSpeedometerWidget.prototype.constructor = IMonSpeedometerWidget;



IMonSpeedometer = {
  widget: {
    name: 'Speedometer',
    description: "Shows connection speed-related data in a selected country.",
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 2, height: 2 },
    resize: { mode: 'cover' },
    typeIcon: 'tachometer',
    constructor: IMonSpeedometerWidget,
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
