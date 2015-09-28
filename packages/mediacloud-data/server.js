Settings = {
  apiKey: Assets.getText('apiKey.txt'),
  baseUrl: 'https://api.mediacloud.org/api/v2/',
  timeout: 60 * 1000, // MediaCloud can be slow to respond to concurrent requests
  stories: {
    defaultTerm: 'Internet',
    defaultCountry: 'US',
    numRows: 30,
    range: [moment().subtract({ days: 1 }), moment()],
    tagSet: EMMCountries,
    updateEvery: moment.duration({ days: 1 }),
    jobQueue: 'mediacloud_stories'
  },
  wordLists: {
    updateEvery: moment.duration({ days: 1 }).asMilliseconds(),
    tagSet: EMMCountries,
    defaultCountry: { code: 'US', name: 'United States' },
    longInterval: { years: 1 }, // Moment.js syntax
    shortInterval: { days: 7 },
    fetchedWords: 300,
    storedWords: 150,
    jobQueue: 'mediacloud_word_lists',
    stopWordLangs: [
      'da', 'de', 'en', 'es', 'fi', 'fr', 'hu', 'it', 'lt', 'nl', 'no',
      'pt', 'ro', 'ru', 'sv', 'tr'
    ]
  }
};

var Future = Npm.require('fibers/future');

fetchData = function(url) {
  return Future.wrap(HTTP.get)(url, { timeout: Settings.timeout });
};

countryCodeToTagId = function(code) {
  var country = _.findWhere(Settings.stories.tagSet, { code: code });
  if (country) { return country.tagId; }
};

Settings.stories.defaultTagId = countryCodeToTagId(Settings.stories.defaultCountry);
