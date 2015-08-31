Settings = {
  updateEvery: moment.duration({ minutes: 5 }).asMilliseconds(),
  numItems: 40,
  listLength: 20
};

FeedItems = new Mongo.Collection('feed_items');
FeedItems.attachSchema(new SimpleSchema({
  title: {
    type: String
  },
  description: {
    type: String,
    optional: true,
  },
  link: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  date: {
    type: Date
  },
  pubdate: {
    type: Date
  },
  image: {
    type: Object,
    optional: true
  },
  'image.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  feed: {
    type: Object
  },
  'feed.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  'feed.title': {
    type: String,
    optional: true
  }
}));

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
    constructor: FeedWidget
  }
};
