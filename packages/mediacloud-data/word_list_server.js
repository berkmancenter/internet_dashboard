var Future = Npm.require('fibers/future');

WordList = {
  needsFetching: function() {
    return WordLists.find().count() < Settings.wordLists.tagSet.length;
  },

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

    var trimmedNew = _.map(
        _.first(newWords, Settings.wordLists.storedWords),
        function(word) { return _.pick(word, ['term', 'count']); });

    return { new: trimmedNew };
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
    var baselineData, recentData;

    try {
      baselineData = baselineDataFut.wait().data;
      recentData = recentDataFut.wait().data;
    } catch (error) {
      console.error('MediaCloud: Error fetching topics');
      console.error(error);
      throw new Error(error);
    }

    var parsedWordLists = WordList.parseWordLists(baselineData, recentData);
    data.words = parsedWordLists;

    try {
      WordLists.upsert({ country: data.country }, { $set: data });
    } catch (error) {
      console.error('MediaCloud: Error inserting topics');
      console.error(error);
      throw new Error(error);
    }
  },

  updateData: function() {
    console.log('MediaCloud: Fetching topic lists');
    var baselineStartDate = moment().subtract(Settings.wordLists.longInterval);
    var startDate = moment().subtract(Settings.wordLists.shortInterval);
    var endDate = moment();
    _.each(Settings.wordLists.tagSet, function(country) {
      // MediaCloud is too slow to do anything concurrently, so no fibers here.
      WordList.updateCountryData(country, baselineStartDate, startDate, endDate);
    });
    console.log('MediaCloud: Fetched topic lists');
  }
};

if (Meteor.settings.doJobs) {
  if (WordList.needsFetching()) {
    Future.task(WordList.updateData);
  }
  Meteor.setInterval(WordList.updateData.future(), Settings.wordLists.updateEvery);
}

Meteor.publish('mc_wordlists', function(countryCode) {
  countryCode = countryCode || Settings.wordLists.defaultCountry.code;
  return WordLists.find({ 'country.code': countryCode }, { limit: 1 });
});
