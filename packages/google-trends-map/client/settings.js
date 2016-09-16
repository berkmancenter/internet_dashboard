Template.GoogleTrendsMapSettings.events({
  'click #keyword-save': function(ev, template) {
    console.log("REINOS PRESSED");
    var keyword = template.$('#keyword').val();
    this.set({
      keyword: keyword,
    });
    console.log(Template.currentData().widget._id);
    console.log('Template.GoogleTrendsMapWidget._id: ' ,  Template.currentData());
    Meteor.call('updateGoogleTrendsMap', keyword, Template.currentData().widget._id);
    template.closeSettings();
  }
});
