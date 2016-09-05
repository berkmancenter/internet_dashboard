Template.AccessCheckChoroplethSettings.events({
  'submit .url-form': function(ev, template) {
    ev.preventDefault();
    var url = template.find('.url').value.toLowerCase();
    this.set({ 
    	url: url
    });
    template.closeSettings();
  }
});
