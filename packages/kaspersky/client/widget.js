Template.KasperskyWidget.onCreated(function() {
  this.subscribe('kasp_metrics');
});

Template.KasperskyWidget.onRendered(function() {
  var template = this;
  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    _.each(Settings.metrics, function(metric) {
      var data = CountryMetrics.findOne({ key: Template.currentData().country.key })
        .metrics[metric.code];
      var pnts = _.map(data, function(d) { return { x: d.date, y: d.count }; });
      pnts = [ { label: metric.name, values: pnts } ];

      if (template.graphs && template.graphs[metric.code]) {
        template.graphs[metric.code].update(pnts);
      } else {
        if (!template.graphs) { template.graphs = {}; }

        template.graphs[metric.code] = template.$(metric.sel).epoch({
          type: 'line',
          data: pnts,
          axes: ['left'],
          ticks: { left: 2 },
          margins: { left: 40, right: 5, top: 20, bottom: 20 },
        });

        template.$(metric.sel)
          .append('<h3 class="metric-name">' + metric.name + '</h3>');
      }
    });
  });
});
