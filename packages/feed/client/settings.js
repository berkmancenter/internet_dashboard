Template.FeedSettings.events({
  'click #feed-save': function(ev, template) {
    var newFeed = template.$('#feed-url').val();
    var title = template.$('#feed-title').val();
    this.set({
      title: title,
      feedUrl: newFeed
    });
    template.closeSettings();
  }
});

