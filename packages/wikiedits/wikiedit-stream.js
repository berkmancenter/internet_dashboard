ThrottledWikiEdits = new Mongo.Collection('throttled_wikiedits');

Settings = {
  updateInterval: moment.duration({ seconds: 2 }).asMilliseconds(),
  defaultWiki: { channel: '#en.wikipedia', name: 'English', code: 'en' },
  listLength: 35,
  editScale: { domain: [1, 50], range: [12, 20] }
};

WikiWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    wiki: Settings.defaultWiki
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
        widget.data.set({ wiki: wiki });
      }
    });
  }
});

WikiStream = {
  widget: {
    name: 'Wikipedia Edits',
    description: 'Shows a streaming list of edits to each language\'s Wikipedia',
    url: 'https://meta.wikimedia.org/wiki/IRC/Channels#Raw_feeds',
    dimensions: { width: 2, height: 2 },
    resize: { mode: 'reflow' },
    category: 'activity',
    typeIcon: 'list',
    constructor: WikiWidget,
    settings: 'change wiki'
  },
  org: {
    name: 'The Wikimedia Foundation, Inc.',
    shortName: 'Wikipedia',
    url: 'https://www.wikipedia.org/'
  }
};
