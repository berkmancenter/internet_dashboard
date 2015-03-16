var wikichanges = Npm.require('wikichanges');
var w = new wikichanges.WikiChanges({ircNickname: 'internet-dashboard'});

w.listen(function(change) {
  console.log(change.page + " " + change.pageUrl)
});
