Settings.timeout = 20 * 1000;

FeedItems._createCappedCollection(10 * 1000 * 1000, 3000);
var Future = Npm.require('fibers/future');
var FeedParser = Npm.require('feedparser');

var fetchFeed = function(feed) {
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
    console.error(error);
  }

  if (response.statusCode !== 200) {
    console.error('Feed: Bad status code ' + res.statusCode);
  }

  feedparser.on('error', function(error) {
    console.error('Feed: Parsing error');
    console.error(error);
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
  console.log('Feed: Fetched ' + feed);
};

var jobName = function(feed, runEvery) {
  runEvery = runEvery || Settings.updateEvery;
  return 'Feed: Fetching ' + feed + ' every ' +
    moment.duration(runEvery).asMinutes() + ' minutes';
};

Meteor.publish('feed_items', function(url) {
  var cursor = FeedItems.find({ 'feed.url': url },
      { limit: Settings.numItems, sort: { pubdate: -1 } });
  var thisJobName = jobName(url, Settings.updateEvery);

  if (!DataJobs.exists(thisJobName)) {
    var job = new DataJob({
      func: function() { fetchFeed.future()(url); },
      name: thisJobName,
      runEvery: Settings.updateEvery,
      runNow: true
    });
    this.connection.onClose(job.cancel.bind(job));
  }

  return cursor;
});
