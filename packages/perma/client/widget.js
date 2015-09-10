Template.PermaWidget.onCreated(function() {
  this.subscribe('perma_archives');
});
Template.PermaWidget.helpers({
  archives: function() {
    return PermaArchives.find({}, { sort: { creation_timestamp: -1 }});
  },
  niceDate: function() {
    Chronos.liveUpdate(Settings.updateTimestampsEvery);
    return moment(this.creation_timestamp).fromNow();
  }
});
