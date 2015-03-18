Template.MediaCloudWidget.helpers({
  country: function() {
    return _.findWhere(Settings.tagSet, { code: this.countryCode });
  },
  words: function() {
    var words = WordLists.findOne({ 'country.code': this.countryCode }).words;
    return _.first(words, Settings.shownWords);
  }
});
