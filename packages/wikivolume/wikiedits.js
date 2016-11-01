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
  defaultChannel: { channel: '#all', name: 'all', code: 'zz' },
  maxBinSpace: 5 * 1024 * 1024, // 5 MB
  maxBinNum: 4000
};

WikiWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    channel: Settings.defaultChannel,
    binWidth: Settings.binWidth
  });
};

WikiWidget.prototype = Object.create(Widget.prototype);
WikiWidget.prototype.constructor = WikiWidget;

_.extend(WikiWidget.prototype, {
  setCountry: function(code) {
    var widget = this;
    CountryInfo.languages(code, function(languages) {
      var wiki = Wikipedias.findOne({ code: { $in: _.pluck(languages, 'alpha2') }});
      if (wiki) {
        widget.data.set({ channel: wiki });
      }
    });
  }
});

WikiEditCounts = {
  widget: {
    name: 'Wikipedia Edit Volume',
    description: 'Shows a streaming graph of the number of edits to each language\'s Wikipedia',
    url: 'https://meta.wikimedia.org/wiki/IRC/Channels#Raw_feeds',
    dimensions: { width: 2, height: 1 },
    category: 'activity',
    typeIcon: 'area-chart',
    constructor: WikiWidget,
    settings: 'edit settings'
  },
  org: {
    name: 'The Wikimedia Foundation, Inc.',
    shortName: 'Wikipedia',
    url: 'https://www.wikipedia.org/'
  }
};
