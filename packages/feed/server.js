FeedItems._createCappedCollection(10 * 1000 * 1000, 3000);

var fetchFeed = function(feed) {
  var FeedParser = Npm.require('feedparser');
  var request = Npm.require('request');

  FeedParser = Npm.require('feedparser');
  feedparser = new FeedParser();

  var options = {
    url: feed,
    headers: {
      'User-Agent': 'InternetMonitorDashboard/1.0 FeedWidget/0.1'
    }
  };

  console.log('Feed: Fetching ' + feed + ' - next fetch at ' + 
      moment().add(Settings.updateEvery).format('HH:mm:ss'));

  var response = Async.runSync(function(done) {
    var req, rss;
    req = request(options);
    req.on('error', function(error) { return done(error, null); });
    req.on('response', function(res) {
      var stream;
      stream = this;
      if (res.statusCode !== 200) {
        return this.emit('error', new Error('Bad Status Code'));
      }

      return stream.pipe(feedparser);
    });

    rss = [];

    feedparser.on('error', function(error) { return done(error, null); });
    feedparser.on('end', function() { return done(null, rss); });

    return feedparser.on('readable', function() {
      var item;
      var stream = this;

      while (item = stream.read()) {
        item.feed = { url: feed, title: stream.meta.title };
        rss.push(item);
      }
    });
  });

  _.each(response.result, function(item) {
    if (FeedItems.find({ link: item.link }).count() === 0) {
      FeedItems.insert(item);
    }
  });
};

var jobs = [];
var Job = function(feed, runEvery) {
  this.feed = feed;
  this.runEvery = runEvery || Settings.updateEvery;
  console.log('Feed: Add fetching job - ' + this.feed + ' every ' +
      moment.duration(this.runEvery).asMinutes() + ' minutes');

  var call = function() {
    fetchFeed(feed);
  };

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
