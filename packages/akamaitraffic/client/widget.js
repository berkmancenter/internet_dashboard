var addFunnel = function(dayChart, template) {
  var startPercent = 100.0 / 24 * 23;
  var highlightWidth = 100.0 / 24;
  var highlightHeight = Settings.funnelHeight;
  var totalWidth = 320;
  dayChart.g.insert('rect', ':first-child').attr({
    x: startPercent + '%',
    y: 0,
    width: highlightWidth + '%',
    height: '100%',
    class: 'funnel'
  });
  d3.select(template.find('.akamai-traffic-funnel'))
  .append('svg').attr({
    height: highlightHeight,
    width: totalWidth
  })
  .append('polygon').attr('points',
      '0 ' + highlightHeight + ', ' +
      totalWidth + ' ' + highlightHeight + ', ' +
      totalWidth + ' 0, ' +
      startPercent / 100.0 * totalWidth + ' 0');
};

Template.AkamaiTrafficWidget.onCreated(function() {
  var template = this;
  this.autorun(function() {
    template.subscribe('visitor_feed', Template.currentData().regionId);
  });
});

Template.AkamaiTrafficWidget.onRendered(function() {
  var hourChart = this.$('.akamai-traffic-hour').epoch({
    axes: [],
    type: 'line',
    margins: { top: 4, right: 0, bottom: 30, left: 0 },
    data: [ { label: 'Hits', values: [] } ]
  });

  var dayChart = this.$('.akamai-traffic-day').epoch({
    axes: [],
    type: 'line',
    margins: { top: 4, right: 0, bottom: 10, left: 0 },
    data: [ { label: 'Hits', values: [] } ]
  });

  var template = this;

  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    var hourData = [ { label: 'Hits', values: [ ] } ];
    var dayData = [ { label: 'Hits', values: [ ] } ];
    var latestFeed = VisitorFeed.findOne(
      { regionId: Template.currentData().regionId },
      { sort: { ts: -1 } }
    );

    hourData[0].values = _.map(latestFeed.lastHour, function(object) {
      return { x: object.timestamp, y: object.value };
    });
    dayData[0].values = _.map(latestFeed.lastDay, function(object) {
      return { x: object.timestamp, y: object.value };
    });
    hourChart.update(hourData);
    dayChart.update(dayData);

    if (dayChart.g.select('rect').empty()) {
      addFunnel(dayChart, template);
    }

    template.$('.akamai-traffic-fetched').text(latestFeed.fetchedAt);
  });
});
