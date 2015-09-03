Settings = {
  defaultCountry: { code: 'US', name: 'United States' },
  shownWords: 20,
  countCutoff: 0,
  tagSet: EMMCountries,
  cloud: {
    heightMulti: 130,
    widthMulti: 158,
    maxRotation: 40,
    fontScale: [8, 30]
  },
};

MCWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    country: Settings.defaultCountry
  });
};
MCWidget.prototype = Object.create(Widget.prototype);
MCWidget.prototype.constructor = MCWidget;
_.extend(MCWidget.prototype, {
  setCountry: function(code) {
    var country = _.findWhere(Settings.tagSet, { code: code });
    if (country) {
      this.data.set({ country: country });
    }
  }
});

MediaCloudTopics = {
  widget: {
    name: 'News Topics',
    description: 'Shows a word cloud of news topics from the past week from each country',
    url: 'http://mediacloud.org',
    dimensions: { width: 2, height: 2 },
    category: 'activity',
    constructor: MCWidget,
  },
  org: {
    name: 'Media Cloud',
    shortName: 'Media Cloud',
    url: 'http://mediacloud.org'
  }
};
