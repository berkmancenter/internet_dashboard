Settings = {
  listLength: 20
};

FeedWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    feedUrl: '',
  });
};
FeedWidget.prototype = Object.create(Widget.prototype);
FeedWidget.prototype.constructor = FeedWidget;

Feed = {
  widget: {
    name: 'Feed',
    description: 'Shows items from an RSS or Atom feed',
    dimensions: { width: 2, height: 3 },
    resize: { mode: 'reflow' },
    typeIcon: 'list',
    constructor: FeedWidget
  }
};
