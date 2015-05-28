Settings.authToken = Assets.getText('authToken.txt');

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

var getNotices = function(page) {
  page = page || Settings.startPage;
  console.log('Lumen: Getting notices - page ' + page);

  // Header auth
  var options = {
    headers: {
      AUTHENTICATION_TOKEN: Settings.authToken,
      Accept: 'application/json',
      'Content-type': 'application/json'
    },
    params: {
      sort_by: 'date_received desc',
      per_page: Settings.perPage,
      page: page
    }
  };

  var url = 'https://chillingeffects.org/notices/search';
  var result = HTTP.get(url, options);
  return result.data.notices;
};

var selectValid = function(notices) {
  var now = Date.now();
  return _.filter(notices, function(notice) {
    return Date.parse(notice.date_received) <= now;
  });
};

var urlCount = function(notice) {
  return _.reduce(notice.works, function(memo, work) {
    return memo + (work.infringing_urls ? work.infringing_urls.length : 0);
  }, 0);
};

var updateLumenCounts = function() {
  var bins = getBins();
  var currentBinI = 0;
  var currentBin = bins[currentBinI];
  var page = Settings.startPage;
  var validNotices, noticeDate;

  var updateBin = function(notice) {
    noticeDate = Date.parse(notice.date_received);

    if (noticeDate < currentBin.end) {
      currentBinI += 1;
    }

    if (currentBinI < bins.length) {
      currentBin = bins[currentBinI];
      currentBin.urlCount += urlCount(notice);
      currentBin.noticeCount += 1;
    }
  };

  while (currentBinI < bins.length) {
    validNotices = selectValid(getNotices(page));
    _.each(validNotices, updateBin);
    page += 1;
  }

  LumenCounts.remove({});
  _.each(bins, function(bin) {
    LumenCounts.insert(bin);
  });
};

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
