Template.GoogleTrendsSettings.events({
  'click #keyword-save': function(ev, template) {
    var keyword = template.$('#keyword').val();
    this.set({
      keyword: keyword
    });
    template.closeSettings();
  }
});

