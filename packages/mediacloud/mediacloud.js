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
    height: 3
  });

  _.defaults(this.data, {
    country: Settings.defaultCountry
  });
};
MCWidget.prototype = Object.create(Widget.prototype);
MCWidget.prototype.constructor = MCWidget;

MediaCloud = {
  displayName: 'Media Cloud',
  description: 'a word cloud showing word usage in recent media in different countries',
  referenceUrl: 'http://mediacloud.org',
  requiredSubs: function() { return ['mc_wordlists']; },
  constructor: MCWidget
};
