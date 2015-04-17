ThrottledWikiEdits._createCappedCollection(6 * 1000 * 1000, 1000);

_.now = Date.now || function() {
  return new Date().getTime();
};

_.throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = _.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        Meteor.clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = Meteor.setTimeout(later, remaining);
    }
    return result;
  };
};

var addEdit = function(edit) {
  //console.log('adding edit');
  ThrottledWikiEdits.insert(edit);
};

_.each(Wikipedias, function(wiki) {
  var throttledAddEdit = _.throttle(addEdit, Settings.throttleWait);
  WikiEdits.find({ channel: wiki.channel, namespace: 'article' }).observe({ added: throttledAddEdit });
});

Meteor.publish('wikistream_edits', function(channel) {
  return ThrottledWikiEdits.find({ channel: channel });
});
