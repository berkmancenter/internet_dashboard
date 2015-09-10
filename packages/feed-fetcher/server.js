Settings.timeout = 20 * 1000;

FeedItems._createCappedCollection(10 * 1000 * 1000, 3000);
var Future = Npm.require('fibers/future');

var fetchFeed = function(feed) {
  var FeedParser = Npm.require('feedparser');
  var Readable = Npm.require('stream').Readable;

  FeedParser = Npm.require('feedparser');
  feedparser = new FeedParser();

  var options = {
    url: feed,
    timeout: Settings.timeout,
    headers: {
      'User-Agent': 'InternetMonitorDashboard/1.0 FeedWidget/0.1'
    }
  };

  console.log('Feed: Fetching ' + feed + ' - next fetch at ' +
      moment().add(Settings.updateEvery).format('HH:mm:ss'));

  var rss = [];

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

  var s = new Readable();
  s._read = function noop() {};
  s.push(response.content);
  s.push(null);

  s.pipe(feedparser);

  feedparser.on('error', function(error) {
    console.error('Feed: Parsing error');
    console.error(error);
  });

  feedparser.on('readable', function() {
    var item;
    var stream = this;

    while (item = stream.read()) {
      item.feed = { url: feed, title: stream.meta.title };
      rss.push(item);
    }
  });

  feedparser.on('end', Meteor.bindEnvironment(function() {
    _.each(rss, function(item) {
      if (FeedItems.find({ link: item.link }).count() === 0) {
        FeedItems.insert(item);
      }
    });
    console.log('Feed: Fetched ' + feed);
  }));
};

var jobs = [];
var Job = function(feed, runEvery) {
  this.feed = feed;
  this.runEvery = runEvery || Settings.updateEvery;
  console.log('Feed: Add fetching job - ' + this.feed + ' every ' +
      moment.duration(this.runEvery).asMinutes() + ' minutes');

  var call = function() {
    fetchFeed(feed);
  }.future();

  call();
  this.timerId = Meteor.setInterval(call, this.runEvery);
  jobs.push(this);
};

Job.prototype.cancel = function() {
  console.log('Feed: Cancel job - ' + this.feed + ' every ' +
      moment.duration(this.runEvery).asMinutes() + ' minutes');
  Meteor.clearTimeout(this.timerId);
  jobs = _.without(jobs, this);
};

var jobExists = function(feed, runEvery) {
  runEvery = runEvery || Settings.updateEvery;
  return !!_.findWhere(jobs, { feed: feed, runEvery: runEvery });
};

Meteor.publish('feed_items', function(url) {
  var cursor = FeedItems.find({ 'feed.url': url },
      { limit: Settings.numItems, sort: { pubdate: -1 } });

  if (!jobExists(url)) {
    var job = new Job(url);
    this.connection.onClose(job.cancel.bind(job));
  }

  return cursor;
});
