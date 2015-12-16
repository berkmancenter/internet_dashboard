Template.BroadbandCostWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_data', Template.currentData().country.code);
  });
});

Template.BroadbandCostWidget.helpers({
  roundedPercent: function() { return (this.percent * 100).toFixed(1); },
  speed: function() {
    var match = this.name.match(Settings.speedRegex)[0];
    if (match === Settings.maxSpeed) {
      match = '>' + match;
    }
    return match;
  },
  percentValue: function() {
    return this.value.toFixed(1) + '%';
  },
  indicators: function() {
    var data = IMonData.find({
      countryCode: Template.currentData().country.code
    }).fetch();

    // Make sure we always return all the indicators, just with empty values
    // where we don't have data.
    return _.map(Settings.indicatorNames, function(name) {
      var indicator = _.findWhere(data, { name: name });
      return _.extend({ name: name }, indicator);
    });
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
