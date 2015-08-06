Template.BroadbandCostWidget.onCreated(function() {
  this.subscribe('imon_countries');
});

Template.BroadbandCostWidget.helpers({
  ready: function() {
    return Template.instance().subscriptionsReady() && !this.isEmpty();
  },
  roundedPercent: function() { return Math.round(this.percent * 100); },
  speed: function() {
    var match = this.name.match(Settings.speedRegex)[0];
    if (match === Settings.maxSpeed) {
      match = '>' + match;
    }
    return match;
  },
  indicators: function() {
    return _.map(Settings.indicatorNames, function(name) {
      return _.extend({ name: name }, this.widget.getIndicatorByName(name));
    }, this);
  },
  cellColor: function() {
    if (_.isUndefined(this.percent)) {
      return 'active';
    }

    var keys = _.keys(Settings.lowerCellClassBounds).sort(function(a, b) {
      return parseInt(b, 10) - parseInt(a, 10);
    });

    var key = _.find(keys, function(key) {
      return this.percent * 100 >= parseInt(key, 10);
    }, this);

    return Settings.lowerCellClassBounds[key];
  }
});
