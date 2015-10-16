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
  }
};

Meteor.publish('mc_stories', function(term, countryCode) {
  var data = { term: term, country: countryCode };
  if (!WidgetJob.exists(Settings.stories.jobQueue, data)) {
    var job = new WidgetJob(Settings.stories.jobQueue, data);
    job.repeat({ wait: Settings.stories.updateEvery }).save();
    this.connection.onClose(function() {
      job.cancel();
      job.remove();
    });
  }

  return Stories.find({ 'term': term, 'country.code': countryCode });
});

Meteor.startup(function() {
  if (Meteor.settings.doJobs) {
    var data = {
      term: Settings.stories.defaultTerm,
      country: Settings.stories.defaultCountry
    };

    if (!WidgetJob.exists(Settings.stories.jobQueue, data)) {
      var job = new WidgetJob(Settings.stories.jobQueue, data);
      job.repeat({ wait: Settings.stories.updateEvery }).save();
    }

    var jobOptions = { concurrency: 2 };
    var worker = function(job, callback) {
      try {
        Story.fetch.future()(job.data.term, job.data.country).wait();
        job.done();
      } catch (e) {
        console.error('MediaCloud: Fetch error - ' + e);
        job.fail("" + e);
      }
      callback();
    };

    Job.processJobs(
        WidgetJob.Settings.queueName,
        Settings.stories.jobQueue,
        jobOptions,
        worker);
  }
});
