/***
 * This allows users to track the number of subscribers to various
 * publications. It's designed to work with multiple app servers.
 *
 * Client C1    Client C2    Client C3
 *        \        /             |
 *        Server S1          Server S2
 *              \          /
 *             Database D1
 *
 * The number of subscriptions is determined by the number of clients, so 3 in
 * this case. Whenever a client subscribes, the server is keeping track in the
 * DB and also adding callbacks. Do we want to add a callback for every
 * subscription? The only callback we really care about right now is when
 * a subscription is empty. To care about that, we only need to add a callback
 * when the subscription hash is first created. We don't want to add that
 * callback back in for every subsequent subscription with the same params. So
 * how to we keep that from happening? The server has to check if it's added
 * a callback already for that.
 *
 * Everything is happening on the same server between the packages. Nothing is
 * on the client. The only thing that one server can do to affect another is
 * change the DB.
 *
 * The callbacks and the query observers get removed when there are no more
 * subscribers to that hash from that server.
 *
 * We'll use each subscription to come up with a hash, which is a combo of the
 * name and params.
 *
 * It needs to be in the database because we need to aggregate across app
 * servers because only one server is doing the jobs that need to be cancelled.
 *
 * This means we need to store sessions in the database. If we store sessions
 * in the database, they're going to persist across server restarts while
 * connections will not. That means whenever a server restarts, we need to
 * remove all of its sessions from the database.
***/

SubCounts = new Meteor.Collection('sub_counts');

SubCounts.attachSchema(new SimpleSchema({
  hostname: { type: String },
  hash: { type: String },
  count: { type: Number, optional: true }
}));
SubCounts._ensureIndex({ hostname: 1 });
SubCounts._ensureIndex({ hash: 1 });
SubCounts._ensureIndex({ hostname: 1, hash: 1 });

var os = Npm.require('os');
var hostname = os.hostname();

Meteor.startup(function() {
  // If we're just starting up, make sure we don't have any sessions in the DB
  console.log('SubCounts: Resetting counts for host "' + hostname + '"');
  SubCounts.update({ hostname: hostname }, { $set: { count: 0 }}, { multi: true });
});

SubCounter = function(doc) {
  doc = doc || {};
  _.extend(this, doc);
  this._queryObservers = {};
  this._callbacks = { change: {}, empty: {} };
};

_.extend(SubCounter.prototype, {
  getCount: function(handler, options) {
    var hash = SubCounter.hash(handler);
    return this._getCount(hash, options);
  },
  count: function(handler) {
    var self = this;
    var hash = SubCounter.hash(handler);
    self._increment(hash);
    handler.onStop(function() { self._onStop(hash); });
  },
  onChange: function(handler, callback) {
    this._addCallback('change', handler, callback);
  },
  onEmpty: function(handler, callback) {
    this._addCallback('empty', handler, callback);
  },
  callbacksOn: function(eventType, handler) {
    var hash = SubCounter.hash(handler);
    return this._callbacks[eventType][hash];
  },

  _addCallback: function(type, handler, callback) {
    var hash = SubCounter.hash(handler);
    if (_.isUndefined(this._callbacks[type])) { return; }

    if (this._callbacks[type][hash]) {
      this._callbacks[type][hash].push(callback);
    } else {
      this._callbacks[type][hash] = [callback];
    }

    if (!this._queryObservers[hash]) {
      this._addObserver(hash);
    }
  },
  _onStop: function(hash) {
    this._decrement(hash);
  },
  _addObserver: function(hash) {
    var query = SubCounts.find({ hostname: hostname, hash: hash });
    var self = this;
    var changed = function(id, changes) { self._changed(hash, changes); };
    var observer = query.observeChanges({ added: changed, changed: changed });

    if (this._queryObservers[hash]) {
      this._queryObservers[hash].push(observer);
    } else {
      this._queryObservers[hash] = [observer];
    }
  },
  _cleanUp: function(hash) {
    this._callbacks.change[hash] = [];
    this._callbacks.empty[hash] = [];
    _.each(this._queryObservers[hash], function(observer) { observer.stop(); });
    this._queryObservers[hash] = [];
  },
  _increment: function(hash) {
    SubCounts.upsert({ hostname: hostname, hash: hash }, { $inc: { count: 1 }});
  },
  _decrement: function(hash) {
    SubCounts.upsert({ hostname: hostname, hash: hash }, { $inc: { count: -1 }});

    // I don't know if < 0 happens, but just in case
    var newCount = this._getCount(hash);
    if (newCount < 0) {
      SubCounts.update({ hash: hash }, { $set: { count: 0 }});
    }
  },
  _changed: function(hash, changes) {
    // Shouldn't happen, but just in case
    if (_.isUndefined(changes.count)) { return; }

    _.each(this._callbacks.change[hash], function(callback) {
      callback(changes.count);
    });

    if (changes.count === 0) {
      _.each(this._callbacks.empty[hash], function(callback) {
        callback();
      });
    }

    if (this._getCount(hash, { justThisServer: true }) === 0) {
      this._cleanUp(hash);
    }
  },
  _getCount: function(hash, options) {
    options = options || {};
    var result;

    if (options.justThisServer) {
      result = SubCounts.findOne({ hostname: hostname, hash: hash });
      return result ? result.count : 0;
    }

    var pipeline = [
      { $match: { hash: hash }},
      { $group: { _id: '$hash', count: { $sum: '$count' }}}
    ];

    result = SubCounts.aggregate(pipeline);
    return _.isEmpty(result) ? 0 : result[0].count;
  }
});


_.extend(SubCounter, {
  hash: function(handler) {
    var data = _.pick(handler, ['_name', '_params']);
    return SHA256(JSON.stringify(data));
  },
  sync: function() {
    /*
    // From http://stackoverflow.com/a/30814101
    var output = {};

    var connections = Meteor.server.stream_server.open_sockets;
    _.each(connections,function(connection){
      // named subscriptions
      var subs = connection._meteorSession._namedSubs;
      for(var sub in subs){
        var mySubName = subs[sub]._name;

        if(subs[sub]._params.length>0){
          mySubName += subs[sub]._params[0];  // assume one id parameter for now
        }

        if(!output[mySubName]){
          output[mySubName] = 1;
        }else{
          output[mySubName] += 1;
        }
      }
      // there are also these 'universal subscriptions'
      //not sure what these are, i count none in my tests
      var usubs = connection._meteorSession._universalSubs;

    });
    console.log(output);
    */
  }
});
