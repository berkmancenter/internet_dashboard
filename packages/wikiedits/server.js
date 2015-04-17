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
  return result;
};

Meteor.publish('wikiedits_binned', function(channel, historyLength) {
  var self = this;
  var binIds = [];
  Meteor.setInterval(function() {
    var since = moment().subtract(historyLength, 'milliseconds').toDate();
    var bin = fetchBin(channel, since);
    if (bin[0]) {
      bin = bin[0];
      bin.time = since;
      var binId = Random.id();
      binIds.push(binId);
      if (binIds.length > Settings.windowSize) {
        var removeId = binIds.shift();
        self.removed('wikibins', removeId);
      }
      self.added('wikibins', binId, bin);
    }
  }, Settings.refreshEvery);
  self.ready();
});
