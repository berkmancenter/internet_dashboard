Settings = {
  maxCollectionSpace: 6 * 1024 * 1024, // 6 MB
  maxCollectionNum: 10000 // Number of docs in collection
};

var Future = Npm.require('fibers/future');

WikiEdits = new Mongo.Collection('wikiedits');
WikiEdits._createCappedCollection(Settings.maxCollectionSpace, Settings.maxCollectionNum);

var wikichanges = Npm.require('wikichanges');

Wikipedias = _.map(_.keys(wikichanges.wikipedias), function(channelName) {
  return {
    channel: channelName,
    name: wikichanges.wikipedias[channelName].long,
    code: wikichanges.wikipedias[channelName].short,
  };
});

Wikipedias.push({ channel: '#all', name: 'All Wikipedia', code: 'zz' });

if (Meteor.settings.doJobs) {
  var changeListener = Future.task(function() {
    return new wikichanges.WikiChanges({ircNickname: 'internet-dashboard'});
  }).wait();

  changeListener.listen(Meteor.bindEnvironment(function(change) {
    change.ts = new MongoInternals.MongoTimestamp(0, 0);
    change.created = new Date();
    WikiEdits.insert(change);
  }));
  console.log('WikiData: Listening for wiki edits');
}

Meteor.publish('wikipedias', function() {
  _.each(Wikipedias, function(channel) {
    this.added('wikipedias', channel.channel, channel);
  }, this);
  this.ready();
});
