Utils = Utils || {};

_.extend(Utils, {
  Subs: { 
    allReady: function(handles) {
    return _.every(handles, function(handle) { return handle.ready(); });
    }
  }
});
