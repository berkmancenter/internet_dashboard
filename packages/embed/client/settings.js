Template.EmbedSettings.helpers({
  resizeModeIs: function(mode) {
    return this.widget.resize.mode === mode;
  }
});

Template.EmbedSettings.events({
  'click #embed-save': function(ev, template) {
    var newCode = template.$('#embed-code').val();
    Meteor.call('setContent', this.widget._id, newCode);

    /*
    var resizeMode = template.$('input:radio[name="embed-resize"]:checked').val();
    this.widget.set({ 'resize.mode': resizeMode });
    */
    template.closeSettings();
  }
});
