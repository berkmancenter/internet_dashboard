Story = {
  url: function(args) {
    var dateFormat = 'YYYY-MM-DD';
    args = args || {};
    args.startDate = args.startDate ? args.startDate.format(dateFormat) :
      Settings.stories.range[0].format(dateFormat);
    args.endDate = args.endDate ? args.endDate.format(dateFormat) :
      Settings.stories.range[1].format(dateFormat);
    args.term = args.term ? encodeURIComponent(args.term) :
      encodeURIComponent(Settings.stories.defaultTerm);
    args.rows = args.rows || Settings.stories.numRows;
    args.tagId = args.tagId || Settings.stories.defaultTagId;
    args.apiKey = args.apiKey || Settings.apiKey;

    var urlTemplate = Settings.baseUrl + 'stories_public/list?' +
      'q=tags_id_media:<%= tagId %>+AND+sentence:<%= term %>&' +
      'fq=publish_date%3A%5B<%= startDate %>T00%3A00%3A00Z%20TO%20' +
        '<%= endDate %>T00%3A00%3A00Z%5D&' +
      'rows=<%= rows %>&' +
      'key=<%= apiKey %>';
    return _.template(urlTemplate)(args);
  },
  fetch: function(term, countryCode) {
    var url = Story.url({ term: term, tagId: countryCodeToTagId(countryCode)});
    console.log('MediaCloud: Fetching data for "' + term + '" in ' +
        countryCode);
    var stories = fetchData(url).wait().data;
    console.log('MediaCloud: Fetched data for "' + term + '" in ' +
        countryCode);
    var country = _.findWhere(Settings.stories.tagSet, { code: countryCode });
    var data = {
      country: country,
      term: term,
      updated: new Date(),
      stories: stories
    };
    var mostRecent = Story.mostRecentDate(term, countryCode);
    Stories.insert(data);

    // Throw away the old stories so we don't grow forever
    Stories.remove({
      'country.code': country.code,
      term: term,
      updated: { $lte: mostRecent }
    });
  },
  jobs: [],
  mostRecentDate: function(term, countryCode) {
    var pipeline = [
      { $match: { 'country.code': countryCode, term: term } },
      { $group: { _id: null, max: { $max: "$updated" } } }
    ];
    var agg = Stories.aggregate(pipeline);
    if (agg.length > 0) {
      return agg[0].max;
    }
  }
};

Story.Job = function(term, countryCode, runEvery) {
  this.term = term;
  this.countryCode = countryCode;
  this.runEvery = runEvery || Settings.stories.updateEvery;
  console.log('MediaCloud: Add fetching job - "' + this.term +
      '" in ' + this.countryCode + ' every ' +
      moment.duration(this.runEvery).asDays() + ' days');

  var call = function() {
    Story.fetch(term, countryCode);
  };

  call();
  this.timerId = Meteor.setInterval(call, this.runEvery);
  Story.jobs.push(this);
};

Story.Job.prototype.cancel = function() {
  console.log('MediaCloud: Cancel job - "' + this.term +
      '" in ' + this.countryCode + ' every ' +
      moment.duration(this.runEvery).asDays() + ' days');
  Meteor.clearTimeout(this.timerId);
  jobs = _.without(jobs, this);
};

Story.Job.exists = function(term, countryCode, runEvery) {
  runEvery = runEvery || Settings.updateEvery;
  return !!_.findWhere(Story.jobs,
      { term: term, countryCode: countryCode, runEvery: runEvery });
};

new Story.Job(Settings.stories.defaultTerm, Settings.stories.defaultCountry);

Meteor.publish('mc_stories', function(term, countryCode) {
  return Stories.find({ 'term': term, 'country.code': countryCode });
});
