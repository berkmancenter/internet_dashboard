Template.WikiStreamWidget.onCreated(function() {
  var template = this;
  template.editScale = d3.scale.linear()
    .domain(Settings.editScaleDomain).range(Settings.editScaleRange).clamp(true);

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
