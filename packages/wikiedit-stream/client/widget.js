Template.WikiStreamWidget.onCreated(function() {
  var template = this;

  template.autorun(function() {
    if (template.sub) {
      console.log('stopping sub');
      template.sub.stop();
    }
    console.log('subbing ' + Template.currentData().channel.channel);
    template.sub = template.subscribe(
      'wikistream_edits', Template.currentData().channel.channel
    );
  });
});

Template.WikiStreamWidget.onRendered(function() {
  var template = this;

  ThrottledWikiEdits.find().observe({
    added: function(edit) {
      template.$('.wikiedits').prepend('<li><a target="_blank" class="' + 
        (edit.delta > 0 ? 'text-success' : 'text-danger') + '" href="'
        + edit.pageUrl + '">' + edit.page + '</a></li>');
      template.$('.wikiedits li').slice(Settings.listLength - 1).remove();
    }
  });
});
