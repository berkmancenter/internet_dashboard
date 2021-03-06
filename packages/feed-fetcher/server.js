Settings.jobType = 'feed_fetcher';
Settings.timeout = 20 * 1000;

FeedItems._createCappedCollection(10 * 1000 * 1000, 3000);
FeedItems._ensureIndex({ 'feed.url': 1 });
var Future = Npm.require('fibers/future');
var FeedParser = Npm.require('feedparser');

var fetchFeed = function(feed, callback) {
  var options = {
    url: feed,
    timeout: Settings.timeout,
    headers: {
      'User-Agent': 'InternetMonitorDashboard/1.0 FeedWidget/0.1'
    }
  };

  var feedparser = new FeedParser();

  console.log('Feed: Fetching ' + feed);

  var response;
  try {
    response = Future.wrap(HTTP.get)(feed, options).wait();
  } catch (error) {
    console.error('Feed: Fetching error');
    throw new Error(error);
  }

  if (response.statusCode !== 200) {
    console.error('Feed: Bad status code ' + res.statusCode);
    throw new Error('Feed: Bad status code ' + res.statusCode);
  }

  feedparser.on('error', function(error) {
    console.error('Feed: Parsing error');
    throw new Error(error);
  });

  feedparser.on('readable', function() {
    var item;

    while (item = feedparser.read()) {
      item.feed = { url: feed, title: feedparser.meta.title };
      if (FeedItems.find({ link: item.link }).count() === 0) {
        FeedItems.insert(item);
      }
    }
  });

  feedparser.write(response.content);
  feedparser.end();
  callback && callback();
  console.log('Feed: Fetched ' + feed);
};

Meteor.publish('feed_items', function(url) {
  var data = { url: url };

  if (!WidgetJob.exists(Settings.jobType, data)) {
    var job = new WidgetJob(Settings.jobType, data);
    job.repeat({ wait: Settings.updateEvery }).save();
    job.stopWhenNoSubsTo(this);
  }

  WidgetJob.trackSub(this);

  var cursor = FeedItems.find({ 'feed.url': url },
      { limit: Settings.numItems, sort: { pubdate: -1 } });

  return cursor;
});

// Run the jobs
if (Meteor.settings.doJobs) {
  Meteor.startup(function() {
    var jobOptions = {
      concurrency: 2,
      workTimeout: 10 * 60 * 1000,
    };
    var worker = function(job, callback) {
      try {
        fetchFeed.future()(job.data.url).wait();
        job.done();
      } catch (e) {
        console.error('Feed: ' + e);
        job.fail("" + e);
      }
      callback();
    };

    Job.processJobs(
        WidgetJob.Settings.queueName, Settings.jobType, jobOptions, worker);
  });
}
