if (Meteor.isClient) {
  Wikipedias = new Mongo.Collection('wikiedit_wikipedias');
}

Settings = {
  historyLength: moment.duration({ seconds: 5 }).asMilliseconds(),
  refreshEvery: moment.duration({ seconds: 1 }).asMilliseconds(),
  defaultChannel: { channel: '#all', name: 'all' }
};

WikiWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 1
  });

  _.defaults(this.data, {
    channel: Settings.defaultChannel,
    historyLength: Settings.historyLength
  });
};

WikiWidget.prototype = Object.create(Widget.prototype);
WikiWidget.prototype.constructor = WikiWidget;

WikiEditCounts = {
  displayName: 'Wikipedia edits',
  description: 'a steaming graph of the number of edits to various wikipedias',
  referenceUrl: 'https://meta.wikimedia.org/wiki/IRC/Channels#Raw_feeds',
  constructor: WikiWidget
};
