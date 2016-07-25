DATA = {};

Template.AccessIndexWidget.onCreated(function(){
  var template = this;
  template.subscribe('imon_countries_v2');
});

Template.AccessIndexWidget.onRendered(function() {
  var id = Template.instance().data.widget._id;
  Meteor.call('rankData', function(e, r){ // Meteor.method in 'server/oldAPI.js'
    DATA = r; // just for easier usage here.
    Session.set(id+'-data', true);
  }); 
});

Template.AccessIndexWidget.helpers({
  dataReady: function(){
    var id = Template.instance().data.widget._id;
    return Session.get(id+'-data');
  },
  score: function() {
    return this.score.toFixed(2);
  },
  country: function() {
    return DATA[Template.currentData().country.code];
  },
  accessUrl: function(code){
    return 'https://thenetmonitor.org/countries/' + code + '/access';
  },
  imageUrl: function(code){
    return 'https://thenetmonitor.org/countries/' + code + '/thumb';
  },
  ranks: function() {
    var width = Math.floor(Settings.numRanks / 2);
    var rank = this.rank;
    var min = Math.max(1, rank - width);
    var max = Math.min(Object.keys(DATA).length, rank + width) + 1;
    return _.map(_.range(min, max), function(r) {
      return {
        rank: r,
        offset: r - rank,
        rankedCountry: findByRank(r, DATA)
      };
    });
  },
  rankClass: function() {
    if (this.offset < 0) {
      return 'higher-ranked';
    } else if (this.offset === 0) {
      return 'this-rank';
    }

    return 'lower-ranked';
  },
  isThisRank: function() {
    return this.offset === 0;
  },
  barWidth: function() {
    return this.score / 10.0 * 100;
  }
});

function findByRank(rank, obj){
  for(country in obj){
    if(obj[country].rank === rank)
      return obj[country];
  }
}
