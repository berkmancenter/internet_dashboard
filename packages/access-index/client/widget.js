Template.AccessIndexWidget.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.AccessIndexWidget.helpers({
  ready: function() {
    return Template.instance().subscriptionsReady() && !this.isEmpty();
  },
  ranks: function() {
    var width = Math.floor(Settings.numRanks / 2);
    var rank = Template.currentData().access.rank;
    var min = Math.max(1, rank - width);
    var max = Math.min(IMonCountries.find().count(), rank + width) + 1;
    return _.map(_.range(min, max), function(r) {
      return {
        rank: r,
        offset: r - rank,
        country: IMonCountries.findOne({ 'access.rank': r })
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
    return this.access.score / 10.0 * 100;
  }
});
