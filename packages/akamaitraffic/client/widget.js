Template.AkamaiTrafficWidget.onCreated(function() {
  this.subscribe('visitor_feed', Template.currentData().regionId);
});

Template.AkamaiTrafficWidget.onRendered(function() {
  var hourChart = this.$('.akamai-traffic-hour').epoch({
    axes: [],
    type: 'line',
    margins: { top: 4, right: 0, bottom: 4, left: 0 },
    data: [ { label: 'Hits', values: [] } ]
  });

  var dayChart = this.$('.akamai-traffic-day').epoch({
    axes: [],
    type: 'line',
    margins: { top: 4, right: 0, bottom: 4, left: 0 },
    data: [ { label: 'Hits', values: [] } ]
  });

  var template = this;

  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    var hourData = [ { label: 'Hits', values: [ ] } ];
    var dayData = [ { label: 'Hits', values: [ ] } ];
    var latestFeed = VisitorFeed.findOne({ regionId: template.data.regionId });

    hourData[0].values = _.map(latestFeed.lastHour, function(object) {
      return { x: object.timestamp, y: object.value };
    });
    dayData[0].values = _.map(latestFeed.lastDay, function(object) {
      return { x: object.timestamp, y: object.value };
    });
    hourChart.update(hourData);
    dayChart.update(dayData);
    template.$('.akamai-traffic-fetched').text(latestFeed.fetchedAt);
  });
});
