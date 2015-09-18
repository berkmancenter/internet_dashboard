Template.AccessIndexWidget.onCreated(function() {
  var template = this;
  template.subscribe('imon_countries');
  template.autorun(function() {
    template.subscribe('imon_data', Template.currentData().country.code);
  });
});

Template.AccessIndexWidget.helpers({
  country: function() {
    return IMonCountryData.findOne({ code: Template.currentData().country.code });
  },
  ranks: function() {
    var width = Math.floor(Settings.numRanks / 2);
    var rank = this.access.rank;
    var min = Math.max(1, rank - width);
    var max = Math.min(IMonCountries.find().count(), rank + width) + 1;
    return _.map(_.range(min, max), function(r) {
      return {
        rank: r,
        offset: r - rank,
        rankedCountry: IMonCountries.findOne({ rank: r })
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
