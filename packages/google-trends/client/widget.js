Template.GoogleTrendsWidget.onCreated(function() {
  var template = this;

  ///template.autorun(function() {
   // var keyword = Template.currentData().keyword;
    //if (keyword) { template.subscribe('trends', keyword); }
  //});

});

Template.GoogleTrendsWidget.helpers({
  widgetTitle: function() {
    return this.title || 'Google Trends';
  },

});
