Template.FeedWidget.onCreated(function() {
  var template = this;

  template.autorun(function() {
    var feedUrl = Template.currentData().feedUrl;
    if (feedUrl) { template.subscribe('feed_items', feedUrl); }
  });

});

Template.FeedWidget.helpers({
  widgetTitle: function() {
    return this.title || 'Feed Items';
  },
  feedItems: function() {
    return FeedItems.find({ 'feed.url': this.feedUrl }, { sort: { date: -1 } });
  },
  feedTitle: function() {
    var firstItem = FeedItems.findOne({ 'feed.url': this.feedUrl });
    if (firstItem) {
      return firstItem.feed.title;
    }
    return this.feedUrl;
  },
});

Template.FeedItem.helpers({
  niceDate: function() {
    return moment(this.pubdate).format('h:mm A - ddd, MMM Do, YYYY');
  }
});
