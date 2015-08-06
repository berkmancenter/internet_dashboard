Template.EmbedSettings.events({
  'click #embed-save': function(ev, template) {
    var newCode = template.$('#embed-code').val();
    Meteor.call('setContent', this.widget._id, newCode);
    template.closeSettings();
  }
});
