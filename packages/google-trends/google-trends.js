Settings = {
  listLength: 20
};

GoogleTrendsWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    keyword: 'node.js',
  });
};
GoogleTrendsWidget.prototype = Object.create(Widget.prototype);
GoogleTrendsWidget.prototype.constructor = GoogleTrendsWidget;

GoogleTrends = {
  widget: {
    name: 'Google Trends',
    description: 'Shows data in various ways from Google Trends -- unfinished',
    dimensions: { width: 3, height: 3 },
    resize: { mode: 'reflow' },
    typeIcon: 'list',
    constructor: GoogleTrendsWidget
  }
};
