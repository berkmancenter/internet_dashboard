var Future = Npm.require('fibers/future');

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
    var country = _.findWhere(Settings.stories.tagSet, { code: countryCode });
    var data = {
      country: country,
      term: term,
      updated: new Date(),
      stories: stories
    };

    try {
      // Throw away the old stories so we don't grow forever
      Stories.remove({ 'country.code': country.code, term: term });
      Stories.insert(data);
    } catch (error) {
      console.log('MediaCloud: Error inserting data');
      console.error(error);
    }

    console.log('MediaCloud: Fetched data for "' + term + '" in ' +
        countryCode);
  },
  jobs: [],
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
  }.future();

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
  runEvery = runEvery || Settings.stories.updateEvery;
  return !!_.findWhere(Story.jobs,
      { term: term, countryCode: countryCode, runEvery: runEvery });
};

new Story.Job(Settings.stories.defaultTerm, Settings.stories.defaultCountry);

Meteor.publish('mc_stories', function(term, countryCode) {
  if (!Story.Job.exists(term, countryCode)) {
    var job = new Story.Job(term, countryCode);
    this.connection.onClose(job.cancel.bind(job));
  }

  return Stories.find({ 'term': term, 'country.code': countryCode });
});
