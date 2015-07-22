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
  selected: function(wiki) {
    return (this.channel === wiki.channel) ? 'selected' : '';
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
      wiki: { channel: channel, name: name },
    };
    this.set(data);
    template.closeSettings();
  }
});
