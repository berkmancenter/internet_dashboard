ThrottledWikiEdits = new Mongo.Collection('throttled_wikiedits');

Settings = {
  updateInterval: moment.duration({ seconds: 2 }).asMilliseconds(),
  defaultChannel: { channel: '#en.wikipedia', name: 'English Wikipedia' },
  listLength: 20,
  editScaleDomain: [1, 50],
  editScaleRange: [12, 20],
};

WikiWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 2
  });

  _.defaults(this.data, {
    channel: Settings.defaultChannel
  });
};

WikiWidget.prototype = Object.create(Widget.prototype);
WikiWidget.prototype.constructor = WikiWidget;

WikiStream = {
  widget: {
    name: 'Wikipedia edits',
    description: 'Shows a streaming list of edits to each language\'s Wikipedia',
    url: 'https://meta.wikimedia.org/wiki/IRC/Channels#Raw_feeds',
    constructor: WikiWidget
  },
  org: {
    name: 'The Wikimedia Foundation, Inc.',
    shortName: 'Wikipedia',
    url: 'https://www.wikipedia.org/'
  }
};
