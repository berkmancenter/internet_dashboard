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
_.extend(GlobalVoicesWidget.prototype, {
  setCountry: function(code) {
    this.data.set({ feed: _.findWhere(feedUrls, { code: code }) });
  }
});

GlobalVoices = {
  widget: {
    name: 'Global Voices Stories',
    description: 'Shows recent Global Voices stories from a selected country',
    dimensions: { width: 2, height: 3 },
    resize: { mode: 'reflow' },
    category: 'activity',
    typeIcon: 'list',
    url: 'http://globalvoicesonline.org/feeds/',
    constructor: GlobalVoicesWidget,
    country: 'single',
    countries: 'CountryInfo'
  },
  org: {
    name: 'Global Voices Online',
    shortName: 'Global Voices',
    url: 'http://globalvoicesonline.org/'
  }
};
