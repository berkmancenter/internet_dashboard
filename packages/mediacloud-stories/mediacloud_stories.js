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
    name: 'Media Monitor',
    description: 'Shows a list of recent articles from a selected country that include a selected term',
    url: 'http://mediacloud.org',
    dimensions: { width: 2, height: 3 },
    resize: { mode: 'reflow' },
    category: 'activity',
    typeIcon: 'list',
    constructor: MCStoryWidget,
    country: 'single',
    countries: getCountryCodes(Settings.tagSet),
    settings: 'edit settings'
  },
  org: {
    name: 'Media Cloud',
    shortName: 'Media Cloud',
    url: 'http://mediacloud.org'
  }
};

function getCountryCodes(tagSet){
  var result = [];
  for(var i=0; i<tagSet.length; i++){
    result.push(tagSet[i].code);
  }
  return result;
}
