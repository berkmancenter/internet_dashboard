Template.WikiStreamSettings.onCreated(function() {
  this.subscribe('wikipedias');
});

Template.WikiStreamSettings.helpers({
  wikis: function() {
    return Wikipedias.find({}, { sort: { name: 1 } });
  },
  wikiName: function() {
    return this.name.replace(' Wikipedia', '');
  },
  selected: function(channel) {
    return ('#' + this.channel === channel.channel) ? 'selected' : '';
  },
  channel: function() {
    return this.channel.replace('#', '');
  }
});

Template.WikiStreamSettings.events({
  'click .save-settings': function(ev, template) {
    var input = template.find('#wiki-language');
    var channel = '#' + input.value;
    var name = input.selectedOptions[0].innerText;
    var data = {
      channel: { channel: channel, name: name },
    };
    this.set(data);
    this.closeSettings(template);
  }
});
