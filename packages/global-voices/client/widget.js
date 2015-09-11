Template.GlobalVoicesWidget.onCreated(function() {
  var template = this;

  template.autorun(function() {
    var feed = Template.currentData().feed;
    if (feed) {
      var feedUrl = GlobalVoicesWidget.feedUrl(feed);
      template.subscribe('feed_items', feedUrl);
    }
  });

});

Template.GlobalVoicesWidget.helpers({
  feedItems: function() {
    return FeedItems.find({ 'feed.url': GlobalVoicesWidget.feedUrl(this.feed) },
        { sort: { date: -1 } });
  },
  countryName: function() {
    return _.findWhere(CountryInfo.countries, { code: this.feed.code }).name;
  }
});

Template.GVItem.helpers({
  niceDate: function() {
    return moment(this.pubdate).format('h:mm A - ddd, MMM Do, YYYY');
  }
});
