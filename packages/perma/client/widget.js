var thumbStore = new FS.Store.FileSystem("perma_thumbnails");
Thumbnails = new FS.Collection("perma_thumbnails", { stores: [thumbStore] });

Template.PermaWidget.onCreated(function() {
  this.subscribe('perma_archives');
  this.subscribe('perma_thumbnails');
});
Template.PermaWidget.helpers({
  archives: function() {
    return PermaArchives.find({}, { sort: { creation_timestamp: -1 }});
  },
  niceDate: function() {
    Chronos.liveUpdate(Settings.updateTimestampsEvery);
    return moment(this.creation_timestamp).fromNow();
  },
  thumb: function() {
    return Thumbnails.findOne(this.thumb_id);
  }
});
