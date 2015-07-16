WordLists = new Mongo.Collection('mc_wordlists');

Settings = {
  updateEvery: moment.duration({ days: 1 }).asMilliseconds(),
  tagSet: EMMCountries,
  defaultCountry: { code: 'US', name: 'United States' },
  longInterval: { years: 1 }, // Moment.js syntax
  shortInterval: { days: 7 },
  fetchedWords: 500,
  shownWords: 20,
  countCutoff: 0,
  cloud: {
    heightMulti: 130,
    widthMulti: 158,
    maxRotation: 40,
    fontScale: [8, 30]
  },
  stopWordLangs: [
    'da', 'de', 'en', 'es', 'fi', 'fr', 'hu', 'it', 'lt', 'nl', 'no',
    'pt', 'ro', 'ru', 'sv', 'tr'
  ]
};

MCWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    country: Settings.defaultCountry
  });
};
MCWidget.prototype = Object.create(Widget.prototype);
MCWidget.prototype.constructor = MCWidget;

MediaCloud = {
  widget: {
    name: 'News Topics',
    description: 'Shows a word cloud of news topics from the past week from each country',
    url: 'http://mediacloud.org',
    dimensions: { width: 2, height: 2 },
    constructor: MCWidget,
  },
  org: {
    name: 'Media Cloud',
    shortName: 'Media Cloud',
    url: 'http://mediacloud.org'
  }
};
