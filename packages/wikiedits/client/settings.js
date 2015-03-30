Template.WikiEditsSettings.onCreated(function() {
  this.subscribe('wikipedias');
});

Template.WikiEditsSettings.helpers({
  wikis: function() {
    return Wikipedias.find({}, { sort: { name: 1 } });
  },
  wikiName: function() {
    return this.name.replace(' Wikipedia', '');
  },
  historyLength: function() {
    return (this.historyLength / 1000).toString();
  },
  selected: function(channel) {
    return ('#' + this.channel === channel.channel) ? 'selected' : '';
  }
});

Template.WikiEditsSettings.events({
  'click .save-settings': function(ev, template) {
    var input = template.find('#wiki-language');
    var channel = '#' + input.value;
    var name = input.selectedOptions[0].innerText;
    var data = {
      channel: { channel: channel, name: name },
      historyLength: parseInt(template.find('#wiki-history').value, 10) * 1000
    };
    this.set(data);
    this.closeSettings(template);
  }
});
