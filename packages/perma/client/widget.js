Template.PermaWidget.onCreated(function() {
  this.subscribe('perma_archives');
});
Template.PermaWidget.helpers({
  archives: function() {
    return PermaArchives.find({}, { sort: { creation_timestamp: -1 }});
  }
});
