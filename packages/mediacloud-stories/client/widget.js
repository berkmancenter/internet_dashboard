Template.MediaCloudStoriesWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    var data = Template.currentData();
    template.subscribe('mc_stories', data.term, data.country.code);
  });
});

Template.MediaCloudStoriesWidget.helpers({
  stories: function() {
    var countryTerm = Stories.findOne({ 'country.code': this.country.code,
                                    'term': this.term });
    if (!countryTerm) { return []; }
    var stories = _.sortBy(countryTerm.stories, 'publish_date').reverse();
    return stories;
  },
  niceDate: function() {
    return moment(this.publish_date).format('h:mm A - ddd, MMM Do, YYYY');
  }
});
