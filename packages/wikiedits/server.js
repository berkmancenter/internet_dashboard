ThrottledWikiEdits._createCappedCollection(6 * 1000 * 1000, 1000);

var addSampledEdit = function(wiki) {
  var query = { namespace: 'article' };
  if (wiki.channel !== '#all') {
    query.channel = wiki.channel;
  }

  var edit = WikiEdits.findOne(query, { sort: { created: -1 }});
  if (edit) {
    edit.channel = wiki.channel;
    edit._id += edit.channel;
    try {
      ThrottledWikiEdits.insert(edit);
    } catch (e) {
      if (e.code !== 11000) {
        throw e;
      }
    }
  }
};

Meteor.startup(function() {
  _.each(Wikipedias, function(wiki) {
    Meteor.setInterval(function() { addSampledEdit(wiki); }, Settings.updateInterval);
  });
});

Meteor.publish('wikistream_edits', function(channel) {
  var query = { channel: channel };
  return ThrottledWikiEdits.find(query, { sort: { created: -1 }, limit: 1 });
});
