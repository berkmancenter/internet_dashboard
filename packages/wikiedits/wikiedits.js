Edits = new Mongo.Collection('wikiedits');

var requiredPublications = function() {
  return ['wikiedits'];
};

WikiWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 1
  });

  this.data = {
    channel: 'all',
    historyLength: 10 // in seconds
  };
}
WikiWidget.prototype = Object.create(Widget.prototype);
WikiWidget.prototype.constructor = WikiWidget;

WikiEdits = {
  displayName: 'Wikipedia edits',
  description: 'a steaming graph of the number of edits to various wikipedias',
  referenceUrl: 'https://meta.wikimedia.org/wiki/IRC/Channels#Raw_feeds',
  allPublications: ['wikiedits'],
  requiredPublications: requiredPublications,
  constructor: WikiWidget
};
