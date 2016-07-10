Settings = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  suffix: {
    percentage: '%',
    speed: 'kbps'
  },
  defaultData: {
   mode: 'singleIndicator',
   country: ['usa','kor','can','hkg'],
   indicatorName: 'bbrate'
 }
};

IMonTimelineWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

IMonTimelineWidget.prototype = Object.create(Widget.prototype);
IMonTimelineWidget.prototype.constructor = IMonTimelineWidget;


IMonTimeline = {
  widget: {
    name: 'Timeline',
    description: 'Compare several country/indicator trends over time.',
    url: 'https://thenetmonitor.org/sources',
    dimensions: { width: 4, height: 2 },
    constructor: IMonTimelineWidget,
    typeIcon: 'line-chart',
    resize: { mode: 'cover' }
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
