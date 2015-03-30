WikiEdits = new Mongo.Collection('wikiedits');
WikiEdits._createCappedCollection(6 * 1000 * 1000, 10000);

var wikichanges = Npm.require('wikichanges');

Wikipedias = _.map(_.keys(wikichanges.wikipedias), function(channelName) {
  return { channel: channelName, name: wikichanges.wikipedias[channelName].long };
});

Wikipedias.push({ channel: 'all', name: 'All of Wikipedia' });

var changeListener = new wikichanges.WikiChanges({ircNickname: 'internet-dashboard'});

changeListener.listen(Meteor.bindEnvironment(function(change) {
  change.ts = new MongoInternals.MongoTimestamp(0, 0);
  change.created = new Date();
  WikiEdits.insert(change);
}));

Meteor.publish('wikipedias', function() {
  _.each(Wikipedias, function(channel) {
    this.added('wikipedias', Random.id(), channel);
  }, this);
  this.ready();
});
