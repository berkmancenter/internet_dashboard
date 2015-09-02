var Future = Npm.require('fibers/future');

WordList = {
  url: function(args) {
    var dateFormat = 'YYYY-MM-DD';
    args.startDate = args.startDate.format(dateFormat);
    args.endDate = args.endDate.format(dateFormat);
    args.numWords = args.numWords || Settings.wordLists.fetchedWords;
    args.apiKey = args.apiKey || Settings.apiKey;
    args.stopWordLangs = args.stopWordLangs || Settings.wordLists.stopWordLangs;

    var urlTemplate = Settings.baseUrl + 'wc/list?' +
      'languages=<%= stopWordLangs.join("%20") %>&' +
      'q=tags_id_media:<%= tagId %>&' +
      'fq=publish_date%3A%5B<%= startDate %>T00%3A00%3A00Z%20TO' +
      '%20<%= endDate %>T00%3A00%3A00Z%5D&' +
      'num_words=<%= numWords %>&key=<%= apiKey %>';
    return _.template(urlTemplate)(args);
  },

  parseWordLists: function(baseline, recent) {
    var baselineTerms = _.pluck(baseline, 'term');
    var recentTerms = _.pluck(recent, 'term');
    var newTerms = _.difference(recentTerms, baselineTerms);
    var newWords = _.filter(recent, function(row) {
      return _.contains(newTerms, row.term);
    });

    return {
      baseline: baseline,
      recent: recent,
      new: newWords
    };
  },

  updateCountryData: function(country, baselineStartDate, startDate, endDate) {
    var data = {
      country: country,
      updated: new Date(),
      words: {
        baseline: [],
        recent: [],
        new: []
      }
    };

    var baselineWordListUrl = WordList.url({
      tagId: country.tagId,
      startDate: baselineStartDate,
      endDate: endDate
    });

    var wordListUrl = WordList.url({
      tagId: country.tagId,
      startDate: startDate,
      endDate: endDate
    });

    var baselineDataFut = fetchData(baselineWordListUrl);
    var recentDataFut = fetchData(wordListUrl);

    Future.wait(baselineDataFut, recentDataFut);

    var baselineData = baselineDataFut.get().data;
    var recentData = recentDataFut.get().data;

    var parsedWordLists = WordList.parseWordLists(baselineData, recentData);
    data.words = parsedWordLists;

    WordLists.upsert({ 'country.code': data.country.code }, data);
  },

  updateData: function() {
    console.log('MediaCloud: Fetching word lists');
    var baselineStartDate = moment().subtract(Settings.wordLists.longInterval);
    var startDate = moment().subtract(Settings.wordLists.shortInterval);
    var endDate = moment();
    var futures = [];
    _.each(Settings.wordLists.tagSet, function(country) {
      futures.push(
        WordList.updateCountryData.future()(country,
                                            baselineStartDate,
                                            startDate, endDate));
    });
    Future.wait(futures);
    console.log('MediaCloud: Fetched word lists');
  }
};

if (WordLists.find().count() === 0) {
  WordList.updateData();
}

Meteor.setInterval(WordList.updateData, Settings.wordLists.updateEvery);

Meteor.publish('mc_wordlists', function(countryCode) {
  countryCode = countryCode || Settings.wordLists.defaultCountry.code;
  return WordLists.find({ 'country.code': countryCode }, { limit: 1 });
});
