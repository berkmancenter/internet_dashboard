var url = function(args) {
  var dateFormat = 'YYYY-MM-DD';
  args.startDate = args.startDate.format(dateFormat);
  args.endDate = args.endDate.format(dateFormat);
  args.numWords = args.numWords || Settings.fetchedWords;
  args.apiKey = args.apiKey || Settings.apiKey;
  args.stopWordLangs = args.stopWordLangs || Settings.stopWordLangs;

  var urlTemplate = 'https://api.mediacloud.org/api/v2/wc/list?languages=<%= stopWordLangs.join("%20") %>&q=tags_id_media:<%= tagId %>&fq=publish_date%3A%5B<%= startDate %>T00%3A00%3A00Z%20TO%20<%= endDate %>T00%3A00%3A00Z%5D&num_words=<%= numWords %>&key=<%= apiKey %>';
  return _.template(urlTemplate)(args);
};

var fetchData = function(url) {
  var result = HTTP.get(url);
  return result.data;
};

var parseWordLists = function(baseline, recent) {

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
};

var updateData = function() {
  var baselineStartDate = moment().subtract(Settings.longInterval);
  var startDate = moment().subtract(Settings.shortInterval);
  var endDate = moment();
            
  _.each(Settings.tagSet, function(country) {

    console.log('Media Cloud: Fetching ' + country.name);

    var data = {
      country: country,
      updated: new Date(),
      words: {
        baseline: [],
        recent: [],
        new: []
      }
    };

    var baselineWordListUrl = url({
      tagId: country.tagId,
      startDate: baselineStartDate,
      endDate: endDate
    });

    var wordListUrl = url({
      tagId: country.tagId,
      startDate: startDate,
      endDate: endDate
    });

    var baselineData = fetchData(baselineWordListUrl);
    var recentData = fetchData(wordListUrl);

    var parsedWordLists = parseWordLists(baselineData, recentData);
    data.words = parsedWordLists;

    WordLists.upsert({ 'country.code': data.country.code }, data);
  });
};


if (WordLists.find({}).count() === 0) {
  updateData();
}

Meteor.setInterval(updateData, Settings.updateEvery);

Meteor.publish('mc_wordlists', function(countryCode) {
  var countryCode = countryCode || Settings.defaultCountry.code;
  return WordLists.find({ 'country.code': countryCode }, { limit: 1 });
});
