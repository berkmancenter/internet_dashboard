Template.FeedSettings.events({
  'click #feed-save': function(ev, template) {
    var newFeed = template.$('#feed-url').val();
    this.set({ feedUrl: newFeed });
    template.closeSettings();
  }
});

