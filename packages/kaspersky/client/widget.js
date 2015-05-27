Template.KasperskyWidget.onCreated(function() {
  var template = this;

  template.autorun(function() {
    template.subscribe('kasp_metrics', Template.currentData().country.key);
  });
});

Template.KasperskyWidget.onRendered(function() {
  var template = this;
  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    _.each(Settings.metrics, function(metric) {
      var data = CountryMetrics.findOne().metrics[metric.code];
      var pnts = _.map(data, function(d) { return { time: d.date, y: d.count }; });
      pnts = [ { label: metric.name, values: pnts } ];

      template.$(metric.sel).epoch({
        type: 'time.line',
        data: pnts,
        axes: ['left'],
        ticks: { left: 2, time: Math.round(Settings.numPnts / 3) },
        tickFormats: { bottom: function(d) { return moment(d).fromNow(); } },
        margins: { left: 40, right: 0, top: 20, bottom: 20 },
        windowSize: Settings.numPnts,
        historySize: Settings.numPnts
      });

      template.$(metric.sel)
        .append('<h3 class="metric-name">' + metric.name + '</h3>');
    });
  });
});
