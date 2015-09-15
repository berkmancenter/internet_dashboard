Settings = {
  defaultCountry: { code: 'US', name: 'United States' },
  defaultTerm: 'Internet',
  tagSet: EMMCountries
};

MCStoryWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    country: Settings.defaultCountry,
    term: Settings.defaultTerm
  });
};
MCStoryWidget.prototype = Object.create(Widget.prototype);
MCStoryWidget.prototype.constructor = MCStoryWidget;
_.extend(MCStoryWidget.prototype, {
  setCountry: function(code) {
    var country = _.findWhere(Settings.tagSet, { code: code });
    if (country) {
      this.data.set({ country: country });
    }
  }
});

MediaCloudStories = {
  widget: {
    name: 'Term Usage',
    description: 'Shows a list of recent articles from a selected country that include a selected term',
    url: 'http://mediacloud.org',
    dimensions: { width: 2, height: 3 },
    resize: { mode: 'reflow' },
    category: 'activity',
    typeIcon: 'list',
    constructor: MCStoryWidget,
  },
  org: {
    name: 'Media Cloud',
    shortName: 'Media Cloud',
    url: 'http://mediacloud.org'
  }
};
