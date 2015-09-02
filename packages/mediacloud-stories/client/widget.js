MediaCloudStoriesWidget.onCreated(function() {
  this.subscribe('mc_stories', this.term, this.country.code);
});

MediaCloudStoriesWidget.helpers({
  stories: function() {
    return _.pluck(Stories.find({
      'country.code': this.country.code,
      'term': this.term
    }).fetch(), 'stories');
  }
});
