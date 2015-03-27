Edits._createCappedCollection(6 * 1000 * 1000, 10000);

var wikichanges = Npm.require('wikichanges');

var changeListener = new wikichanges.WikiChanges({ircNickname: 'internet-dashboard'});
var wikipedias = wikichanges.wikipedias;

changeListener.listen(Meteor.bindEnvironment(function(change) {
  change.ts = new MongoInternals.MongoTimestamp(0, 0);
  change.created = new Date();
  Edits.insert(change);
}));

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

  var result = Edits.aggregate(pipeline);
  return result;
};

Meteor.publish('wikiedits_binned', function(channel, historyLength) {
  var self = this;
  Meteor.setInterval(function() {
    var since = moment().subtract(historyLength, 'milliseconds').toDate();
    var bin = fetchBin(channel, since);
    if (bin) {
      bin = bin[0];
      bin.time = since;
      self.added('wikibins', Random.id(), bin);
    }
  }, Settings.refreshEvery);
  self.ready();
});

Meteor.publish('wikipedias', function() {
  this.added('wikipedias', Random.id(), { channel: 'all', name: 'All of wikipedia' });
  _.each(_.keys(wikipedias), function(channelName) {
    var channel = { channel: channelName.slice(1), name: wikipedias[channelName].long };
    this.added('wikipedias', Random.id(), channel);
  }, this);
  this.ready();
});
