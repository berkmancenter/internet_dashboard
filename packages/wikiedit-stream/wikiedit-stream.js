ThrottledWikiEdits = new Mongo.Collection('throttled_wikiedits');

if (Meteor.isClient) {
  Wikipedias = new Mongo.Collection('wikistream_wikipedias');
}

Settings = {
  throttleWait: moment.duration({ seconds: 2 }).asMilliseconds(),
  defaultChannel: { channel: '#en.wikipedia', name: 'English Wikipedia' },
  listLength: 20
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
  displayName: 'Wikipedia edit list',
  description: 'a steaming list of the number of edits to various wikipedias',
  referenceUrl: 'https://meta.wikimedia.org/wiki/IRC/Channels#Raw_feeds',
  constructor: WikiWidget
};
