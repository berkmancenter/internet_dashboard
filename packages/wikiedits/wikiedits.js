Edits = new Mongo.Collection('wikiedits');
EditsOverTime = new Mongo.Collection('wikiedits_binned');

if (Meteor.isClient) {
  Wikipedias = new Mongo.Collection('wikipedias');
}

Settings = {
  historyLength: 5, // seconds
  refreshEvery: 1000, // milliseconds
  defaultChannel: 'all'
};

WikiWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 1
  });

  _.extend(this.data, {
    channel: 'all',
    historyLength: Settings.historyLength
  });
};

WikiWidget.prototype = Object.create(Widget.prototype);
WikiWidget.prototype.constructor = WikiWidget;

WikiEdits = {
  displayName: 'Wikipedia edits',
  description: 'a steaming graph of the number of edits to various wikipedias',
  referenceUrl: 'https://meta.wikimedia.org/wiki/IRC/Channels#Raw_feeds',
  constructor: WikiWidget
};
