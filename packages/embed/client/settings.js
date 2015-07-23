Template.EmbedSettings.events({
  'click #embed-save': function(ev, template) {
    var newCode = template.$('#embed-code').val();
    this.set({ embedCode: newCode });
    template.closeSettings();
  }
});
