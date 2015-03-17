Edits._createCappedCollection(6 * 1000 * 1000, 10000);
EditsOverTime._createCappedCollection(6 * 1000 * 1000, 100);

var wikichanges = Npm.require('wikichanges');

var changeListener = new wikichanges.WikiChanges({ircNickname: 'internet-dashboard'});
var wikipedias = wikichanges.wikipedias;

changeListener.listen(Meteor.bindEnvironment(function(change) {
  change.ts = new MongoInternals.MongoTimestamp(0, 0);
  change.created = new Date();
  Edits.insert(change);
}));

var binAndSave = function(time, channel, query) {
  //TODO: Replace this with aggregation once Meteor fully supports Mongo 2.6
  var edits = Edits.find(query).fetch();
  var bin = { channel: channel, time: time, count: edits.length };

  EditsOverTime.insert(bin);
};

var addBin = function() {
  var now = moment();
  var query = {
    created: { $gt: now.subtract(Settings.historyLength, 'seconds').toDate() }
  };
  binAndSave(now.toDate(), 'all', query);
  
  _.each(_.keys(wikipedias), function(wiki) {
    query = { $and: [query, { channel: wiki }] };
    binAndSave(now.toDate(), wiki, query);
  });
};

Meteor.setInterval(function() { Tracker.nonreactive(addBin); }, Settings.refreshEvery);

Meteor.publish('wikiedits_binned', function(data) {
  var channel = data ? data.channel : Settings.defaultChannel;
  return EditsOverTime.find({ channel: channel }, { limit: 1 });
});

Meteor.publish('wikipedias', function() {
  this.added('wikipedias', Random.id(), { channel: 'all', name: 'All of wikipedia' });
  _.each(_.keys(wikipedias), function(channelName) {
    var channel = { channel: channelName.slice(1), name: wikipedias[channelName].long };
    this.added('wikipedias', Random.id(), channel);
  }, this);
  this.ready();
});
