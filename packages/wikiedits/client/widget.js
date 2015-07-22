Template.WikiStreamEdit.onCreated(function() {
  var template = this;
  template.editScale = d3.scale.linear()
    .domain(Settings.editScale.domain).range(Settings.editScale.range).clamp(true);
});

Template.WikiStreamEdit.helpers({
  class: function() {
    return this.delta > 0 ? 'text-success' : 'text-danger';
  },
  style: function() {
    return 'font-size:' +
      Template.instance().editScale(Math.abs(this.delta)) + 'px';
  }
});

Template.WikiStreamWidget.helpers({
  wikiName: function() {
    var name = this.wiki.name;
    if (!/wiki/i.test(name)) { name += ' Wikipedia'; }
    return name;
  }
});

Template.WikiStreamWidget.onCreated(function() {
  var template = this;

  template.autorun(function() {
    var wiki = Template.currentData().wiki;

    if (template.sub && wiki.channel !== template.oldChannel) {
        template.sub.stop();
        template.$('.wikiedits').empty();
    }
    template.sub = template.subscribe('wikistream_edits', wiki.channel);
    template.oldChannel = wiki.channel;
  });

  template.addEdit = function(edit) {
    if (_.isEqual(edit, template.lastEdit)) { return; }
    Blaze.renderWithData(
        Template.WikiStreamEdit, edit, template.find('.wikiedits'),
        template.find('.wikiedits li:first-child'));
    template.$('.wikiedits li').slice(Settings.listLength - 1).remove();
    template.lastEdit = edit;
  };
});

Template.WikiStreamWidget.onRendered(function() {
  var template = this;

  template.autorun(function() {
    var wiki = Template.currentData().wiki;
    var query = { channel: wiki.channel };
    ThrottledWikiEdits.find(query).observe({ added: template.addEdit });
  });
});
