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
  Meteor.setInterval(function() {
    var since = moment().subtract(historyLength, 'milliseconds').toDate();
    var bin = fetchBin(channel, since);
    if (bin[0]) {
      bin = bin[0];
      bin.time = since;
      self.added('wikibins', Random.id(), bin);
    }
  }, Settings.refreshEvery);
  self.ready();
});
