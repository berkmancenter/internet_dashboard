Settings = {
  listLength: 20,
  defaultFeed: _.findWhere(feedUrls, { code: 'US' }),
  baseUrl: 'http://globalvoicesonline.org/-/world/'
};

GlobalVoicesWidget = function(doc) {
  Widget.call(this, doc);

  var defaultFeed = Settings.defaultFeed;
  defaultFeed.feedUrl = GlobalVoicesWidget.feedUrl(defaultFeed);
  _.defaults(this.data, { feed: defaultFeed });
};
GlobalVoicesWidget.prototype = Object.create(Widget.prototype);
GlobalVoicesWidget.prototype.constructor = GlobalVoicesWidget;
GlobalVoicesWidget.feedUrl = function(feed) {
  if (!feed) { return; }
  return Settings.baseUrl + feed.url + '/feed';
};

GlobalVoices = {
  widget: {
    name: 'Recent Global Voices Stories',
    description: 'Shows recent Global Voices stories from a selected country',
    dimensions: { width: 2, height: 3 },
    resize: { mode: 'reflow' },
    category: 'activity',
    constructor: GlobalVoicesWidget
  },
  org: {
    name: 'Global Voices',
    shortName: 'Global Voices',
    url: 'http://globalvoicesonline.org/'
  }
};
