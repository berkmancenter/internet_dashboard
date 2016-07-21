Settings = {
  updateEvery: moment.duration({ minutes: 10 }).asMilliseconds(),
  numItems: 40
};

GoogleTrendsItems = new Mongo.Collection('google_trends_items');
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
