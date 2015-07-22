Settings.authToken = Assets.getText('apiKey.txt');

var getBins = function() {
  var bins = [];
  var binStart = Date.now();

  // Setup our bins with their boundaries
  // This is all in reverse chrono
  _(Settings.numBins).times(function(i) {
    var binEnd = binStart - Settings.binWidth.asMilliseconds();
    bins[i] = {
      start: binStart, // Inclusive
      end: binEnd, // Inclusive
      urlCount: 0,
      noticeCount: 0
    };
    binStart = binEnd - 1;
  });

  return bins;
};

var binRequest = function(bin) {
  return { url: 'https://chillingeffects.org/notices/search',
    options: {
      headers: {
        AUTHENTICATION_TOKEN: Settings.authToken,
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      params: {
        per_page: 1,
        date_received_facet: bin.end + '..' + bin.start
      }
    }
  };
};

var countNoticeUrls = function(notice) {
  return _.reduce(notice.works, function(memo, work) {
    return memo + (work.infringing_urls ? work.infringing_urls.length : 0);
  }, 0);
};

var countBinUrls = function(bin) {
  var request = binRequest(bin);
  request.options.params.per_page = Settings.perPage;
  var totalPages = HTTP.get(request.url, request.options).data.meta.total_pages;

  _(totalPages).times(function(i) {
    var page = i + 1;
    request.options.params.page = page;
    console.log('Lumen: Fetching url counts (page ' + page + ' of ' + totalPages + 
        ') from ' + new Date(bin.end).toUTCString() + ' to ' +
        new Date(bin.start).toUTCString());
    var result = HTTP.get(request.url, request.options);
    _.each(result.data.notices, function(notice) {
      bin.urlCount += countNoticeUrls(notice);
    });
  });
  return bin.urlCount;
}

var updateLumenCounts = function() {
  var bins = getBins();

  LumenCounts.remove({});

  _.each(bins, function(bin) {
    var request = binRequest(bin);
    console.log('Lumen: Fetching notice count from ' +
        new Date(bin.end).toUTCString() + ' to ' +
        new Date(bin.start).toUTCString());
    var result = HTTP.get(request.url, request.options);
    bin.noticeCount = result.data.meta.total_entries;
    if (Settings.countUrls) {
      bin.urlCount = countBinUrls(bin);
    }
    LumenCounts.insert(bin);
  });
};

// If we don't have any counts or our most recent is older than our update
// interval...
if (LumenCounts.find().count() === 0 ||
    LumenCounts.findOne({}, { sort: { start: -1 } }).start +
    Settings.updateEvery.asMilliseconds() < Date.now()) {
  updateLumenCounts();
} else {
  console.log('Lumen: Not updating notice and URL counts');
}
Meteor.setInterval(updateLumenCounts, Settings.updateEvery.asMilliseconds());

Meteor.publish('lumen_counts', function() {
  return LumenCounts.find();
});
