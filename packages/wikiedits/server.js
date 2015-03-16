Edits._createCappedCollection(200 * 10000, 10000); // Looks to cap at about 3153 docs

var wikichanges = Npm.require('wikichanges');

var changeListener = new wikichanges.WikiChanges({ircNickname: 'internet-dashboard'});
var wikipedias = wikichanges.wikipedias;

changeListener.listen(Meteor.bindEnvironment(function(change) {
  change.ts = new MongoInternals.MongoTimestamp(0, 0);
  Edits.insert(change);
}));

Meteor.publish('wikiedits', function(data) {
  var now = moment();
  var query = { ts: { $gt: now.subtract(data.historyLength, 'seconds') } };
  var initialized = false;

  if (data.channel !== 'all') {
    query = { $and: [query, { channel: data.channel }] };
  }

  var addDoc = function() {
    //TODO: Replace this with aggregation once Meteor fully supports Mongo 2.6
    var edits = Edits.find(query).fetch();
    var history = { time: now, y: edits.length };
    var lastId = edits[edits.length - 1]._id;

    this.added('wikiedits', lastId, history);

    if (!initialized) {
      this.ready();
      initialized = true;
    }
  };

  Meteor.setInterval(Tracker.nonreactive(addDoc.bind(this)), 1);
});
