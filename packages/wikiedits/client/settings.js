Template.WikiEditCountsSettings.onCreated(function() {
  this.subscribe('wikipedias');
});

Template.WikiEditCountsSettings.helpers({
  wikis: function() {
    return Wikipedias.find({}, { sort: { name: 1 } });
  },
  wikiName: function() {
    return this.name.replace(' Wikipedia', '');
  },
  binWidth: function() {
    return (this.binWidth / 1000).toString();
  },
  selected: function(channel) {
    return this.channel === channel.channel ? 'selected' : '';
  },
  channel: function() {
    return this.channel.slice(1);
  }
});

Template.WikiEditCountsSettings.events({
  'click .save-settings': function(ev, template) {
    var input = template.find('#wiki-language');
    var channel = '#' + input.value;
    var name = input.selectedOptions[0].innerText;
    var data = {
      channel: { channel: channel, name: name },
      binWidth: parseInt(template.find('#wiki-history').value, 10) * 1000
    };
    this.set(data);
    this.closeSettings(template);
  }
});
