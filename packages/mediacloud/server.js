var url = function(args) {
  var dateFormat = 'YYYY-MM-DD';
  args.startDate = args.startDate.format(dateFormat);
  args.endDate = args.endDate.format(dateFormat);
  args.numWords = args.numWords || Settings.fetchedWords;
  args.apiKey = args.apiKey || Settings.apiKey;

  var urlTemplate = 'https://api.mediacloud.org/api/v2/wc/list?q=tags_id_media:<%= tagId %>&fq=publish_date%3A%5B<%= startDate %>T00%3A00%3A00Z%20TO%20<%= endDate %>T00%3A00%3A00Z%5D&num_words=<%= numWords %>&key=<%= apiKey %>';
  return _.template(urlTemplate)(args);
};

var fetchData = function(url) {
  console.log(url);
  //http.get(url);
};

var updateData = function() {
  var baselineStartDate = moment().subtract(Settings.longInterval);
  var startDate = moment().subtract(Settings.shortInterval);
  var endDate = moment();
            
  _.each(Settings.tagSet, function(country) {
    var data = {
      countryCode: country.code,
      updated: new Date(),
      words: []
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

    fetchData(baselineWordListUrl);
    fetchData(wordListUrl);

    /*
    { word: word, count: count },
    WordLists.upsert({ countryCode: data.countryCode }, data);
    });
    */
  });

};

/*
      onWordCountsChange: function(model, newWordCounts) {
        if (newWordCounts.recent.length === 0 ||
            newWordCounts.baseline.length === 0 ||
            newWordCounts.bSet !== newWordCounts.rSet) {
          return;
        }

        var baselineTerms = _.pluck(newWordCounts.baseline, 'term'),
            recentTerms = _.pluck(newWordCounts.recent, 'term'),
            newTerms = _.difference(recentTerms, baselineTerms),
            newWords = _.filter(newWordCounts.recent, function(row) {
              return _.contains(newTerms, row.term);
            });

        if (this.get('countCutoff') > 0) {
          this.set('newWords', _.filter(newWords, function(row) {
            return row.count >= this.get('countCutoff');
          }, this));
        } else {
          this.set('newWords', _.first(newWords, this.get('numShowWords')));
        }
      },
      */

if (WordLists.find({}).count() === 0) {
  updateData();
}

Meteor.setInterval(updateData, Settings.updateEvery);

Meteor.publish('mc_wordlists', function(data) {
  //WordLists.find
});
