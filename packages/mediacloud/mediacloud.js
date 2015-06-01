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

  stopWordLangs: [
    'da', 'de', 'en', 'es', 'fi', 'fr', 'hu', 'it', 'lt', 'nl', 'no',
    'pt', 'ro', 'ru', 'sv', 'tr'
  ]
};

MCWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 2
  });

  _.defaults(this.data, {
    country: Settings.defaultCountry
  });
};
MCWidget.prototype = Object.create(Widget.prototype);
MCWidget.prototype.constructor = MCWidget;

MediaCloud = {
  widget: {
    name: 'Recent News Topics',
    description: 'Shows a word cloud of news topics from the past week from each country',
    url: 'http://mediacloud.org',
    constructor: MCWidget,
  },
  org: {
    name: 'Media Cloud',
    shortName: 'Media Cloud',
    url: 'http://mediacloud.org'
  }
};
