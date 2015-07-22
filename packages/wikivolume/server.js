BinnedWikiEdits._createCappedCollection(Settings.maxBinSpace, Settings.maxBinNum);
BinnedWikiEdits._ensureIndex({ binStart: 1 },
    { expireAfterSeconds: Settings.binWidth / 1000 * Settings.numBins });

var fetchBin = function(channel, since) {
  var and = [ { created: { $gt: since } }, { namespace: 'article' } ];
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

var binningJobs = [];
var BinningJob = function(channel, binWidth, runEvery) {
  this.channel = channel;
  this.binWidth = binWidth;
  this.runEvery = runEvery || Settings.updateEvery;
  console.log('Wikiedits: Add binning job - ' + this.channel
      + ', ' + this.binWidth + ', ' + this.runEvery);

  var insertCall = function() {
    insertBin(channel, binWidth);
  };

  insertCall();
  this.timerId = Meteor.setInterval(insertCall, this.runEvery);
  binningJobs.push(this);
};
BinningJob.prototype.cancel = function() {
  console.log('Wikiedits: Cancel binning job - ' + this.channel
      + ', ' + this.binWidth + ', ' + this.runEvery);
  Meteor.clearTimeout(this.timerId);
  binningJobs = _.without(binningJobs, this);
};
var binningJobExists = function(channel, binWidth, runEvery) {
  runEvery = runEvery || Settings.updateEvery;
  return !!_.findWhere(binningJobs, {
    channel: channel, binWidth: binWidth, runEvery: runEvery
  });
};

Meteor.publish('wikiedits_binned', function(channel, binWidth) {
  var cursor = BinnedWikiEdits.find({ channel: channel, binWidth: binWidth },
      { limit: Settings.numBins, sort: { binStart: -1 } });

  if (!binningJobExists(channel, binWidth)) {
    var job = new BinningJob(channel, binWidth);
    this.connection.onClose(job.cancel.bind(job));
  }

  return cursor;
});

var defaultJob = new BinningJob(Settings.defaultChannel.channel, Settings.binWidth);
