Template.AkamaiTrafficWidget.onCreated(function() {
  var template = this;
  this.autorun(function() {
    template.subscribe('visitor_feed');
  });
});

Template.AkamaiTrafficWidget.onRendered(function() {
  var template = this;

  var dayChart = template.$('.akamai-traffic-day').epoch({
    axes: ['left'],
    type: 'area',
    margins: { top: 4, right: 0, bottom: 10, left: 40 },
    data: []
  });

  var scale = d3.scale.ordinal()
    .domain(_.pluck(Settings.regions, 'name'))
    .range(['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c']);

  var legend = d3.legend.color().scale(scale);
  var svg = d3.select('svg.legend');
  svg.append('g').call(legend);

  template.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    var dayData = [];
    _.each(Settings.regions, function(region) {
      var regionDayData = { label: region.name, values: [] };

      var latestFeed = VisitorFeed.findOne(
          { regionId: region.code },
          { sort: { ts: -1 }});

      regionDayData.values = _.map(latestFeed.lastDay, function(object) {
        return { x: object.timestamp, y: object.value };
      });

      dayData.push(regionDayData);
    });

    dayChart.update(dayData);
  });
});
