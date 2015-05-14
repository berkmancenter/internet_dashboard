BinnedWikiEdits._createCappedCollection(Settings.maxBinSpace, Settings.maxBinNum);
BinnedWikiEdits._ensureIndex({ binStart: 1 },
    { expireAfterSeconds: Settings.binWidth / 1000 * Settings.numBins });

var fetchBin = function(channel, since) {
  var and = [ { created: { $gt: since } } ];
  if (channel !== '#all') {
    and.push({ channel: channel });
  }

  var pipeline = [
    { $match: {
      $and: and
    } },
    { $group: {
      _id: null,
      count: { $sum: 1 }
    } }
  ];

  var result = WikiEdits.aggregate(pipeline);
  if (result[0]) {
    return result[0];
  }
  return { _id: null, count: 0 };
};

var insertBin = function(channel, binWidth) {
  channel = channel || Settings.defaultChannel.channel;
  binWidth = binWidth || Settings.binWidth;

  var binStart = Date.now();
  var binEnd = new Date(binStart - binWidth);
  var bin = fetchBin(channel, binEnd);

  _.extend(bin, {
    binWidth: binWidth,
    binStart: binStart,
    channel: channel
  });

  BinnedWikiEdits.insert(bin);
  return bin;
};

Meteor.publish('wikiedits_binned', function(channel, binWidth) {
  var cursor = BinnedWikiEdits.find({ channel: channel, binWidth: binWidth },
      { limit: Settings.numBins, sort: { binStart: -1 } });

  if (cursor.count() === 0) {
    var thisInsertCall = function() { insertBin(channel, binWidth); };
    thisInsertCall();
    var timerId = Meteor.setInterval(thisInsertCall, binWidth);
    this.connection.onClose(Meteor.clearTimeout(timerId));
  }

  return cursor;
});

Meteor.setInterval(insertBin, Settings.updateEvery);
