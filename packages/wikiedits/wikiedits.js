BinnedWikiEdits = new Mongo.Collection('wikiedits_binned');
BinnedWikiEdits.attachSchema(new SimpleSchema({
  channel: { type: String },
  binWidth: { type: Number },
  binStart: { type: Date }, // Reverse chrono, so the most recent edge of the bin
  count: { type: Number }
}));

Settings = {
  binWidth: moment.duration({ seconds: 5 }).asMilliseconds(),
  numBins: 30,
  updateEvery: moment.duration({ seconds: 1 }).asMilliseconds(),
  defaultChannel: { channel: '#all', name: 'all' },
  maxBinSpace: 5 * 1024 * 1024, // 5 MB
  maxBinNum: 4000
};

WikiWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 1
  });

  _.defaults(this.data, {
    channel: Settings.defaultChannel,
    binWidth: Settings.binWidth
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
