Template.WikiStreamWidget.onCreated(function() {
  var template = this;
  template.editScale = d3.scale.linear()
    .domain(Settings.editScaleDomain).range(Settings.editScaleRange).clamp(true);

  template.autorun(function() {
    if (template.sub) {
      template.sub.stop();
      template.$('.wikiedits').empty();
    }
    template.sub = template.subscribe(
      'wikistream_edits', Template.currentData().channel.channel
    );
  });
});

Template.WikiStreamWidget.onRendered(function() {
  var template = this;

  template.autorun(function() {
    ThrottledWikiEdits.find({ channel: Template.currentData().channel.channel }).observe({
      added: function(edit) {
        d3.select(template.find('.wikiedits')).insert('li', ':first-child')
        .append('a')
        .attr({
          target: "_blank",
          class: function() { return (edit.delta > 0 ? 'text-success' : 'text-danger'); },
          href: edit.pageUrl
        })
        .style('font-size', function() { return template.editScale(Math.abs(edit.delta)) + 'px'; })
        .text(edit.page);
        template.$('.wikiedits li').slice(Settings.listLength - 1).remove();
      }
    });
  });
});
