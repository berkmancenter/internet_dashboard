Template.MediaCloudWidget.onCreated(function() {
  this.subscribe('mc_wordlists');
});

Template.MediaCloudWidget.helpers({
  words: function() {
    var words = WordLists.findOne({ 'country.code': this.country.code });
    console.log(words);
    /*
    if (Settings.countCutoff > 0) {
      newWords = _.filter(newWords, function(row) {
        return row.count >= Settings.countCutoff;
      });
    }
    */
    return words;
  },
  trimList: function(list) {
    return _.first(list, Settings.shownWords);
  }
});
