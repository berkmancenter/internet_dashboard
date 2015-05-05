Template.MediaCloudWidget.onCreated(function() {
  var template = this;
  this.autorun(function() {
    template.subscribe('mc_wordlists', Template.currentData().country.code);
  });
});

Template.MediaCloudWidget.helpers({
  words: function() {
    var words = WordLists.findOne({ 'country.code': this.country.code });
    /*
    if (Settings.countCutoff > 0) {
      newWords = _.filter(newWords, function(row) {
        return row.count >= Settings.countCutoff;
      });
    }
    */
    return words.words;
  },
  trimList: function(list) {
    return _.first(list, Settings.shownWords);
  }
});
