ThrottledWikiEdits._createCappedCollection(6 * 1000 * 1000, 1000);

var addSampledEdit = function(wiki) {
  var query = { namespace: 'article' };
  if (wiki.channel !== '#all') {
    query.channel= wiki.channel;
  }

  var edit = WikiEdits.findOne(query, { sort: ['ts', 'desc'] });
  if (edit) {
    ThrottledWikiEdits.upsert({ _id: edit._id }, { $set: edit });
  }
};

_.each(Wikipedias, function(wiki) {
  Meteor.setInterval(function() { addSampledEdit(wiki); }, Settings.updateInterval);
});

Meteor.publish('wikistream_edits', function(channel) {
  return ThrottledWikiEdits.find({ channel: channel });
});
