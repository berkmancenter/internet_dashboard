WordLists = new Mongo.Collection('mc_wordlists');

Settings = {
  updateEvery: moment.duration({ days: 1 }).asMilliseconds(),
  tagSet: EMMCountries,
  defaultCountry: 'US',
  longInterval: { years: 1 }, // Moment.js syntax
  shortInterval: { days: 7 },
  fetchedWords: 500,
  shownWords: 20,
  apiKey: '1592b19f2d8dccec2e49b0e503b83dc0d06bd831f95a8b008da39b72032e5196'
};

MCWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 2
  });
  this.data = {
    countryCode: Settings.defaultCountry
  };
};
MCWidget.prototype = Object.create(Widget.prototype);
MCWidget.prototype.constructor = MCWidget;

var requiredPublications = function(data) {
  return ['mc_wordlists'];
};

MediaCloud = {
  displayName: 'Media Cloud',
  description: 'a word cloud showing word usage in recent media in different countries',
  referenceUrl: 'http://mediacloud.org',
  allPublications: [],
  requiredPublications: requiredPublications,
  constructor: MCWidget
};
