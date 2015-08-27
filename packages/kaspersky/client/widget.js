Template.KasperskyWidget.onCreated(function() {
  this.subscribe('kasp_metrics');
});

Template.KasperskyWidget.onRendered(function() {
  var template = this;
  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    var country = CountryMetrics.findOne({ key: Template.currentData().country.key });
    if (!country) { return; }

    _.each(Settings.metrics, function(metric) {
      var data = country.metrics[metric.code];
      var $graph = template.$(metric.sel);
      if (_.isEmpty(data)) {
        $graph.find('svg').hide();
        if ($graph.find('.no-data').length === 0) {
          $graph.append('<p class="no-data">No data available.</p>');
        }
        return;
      } else {
        $graph.find('.no-data').remove();
        $graph.find('svg').show();
      }
      var pnts = _.map(data, function(d) { return { x: d.date, y: d.count }; });
      pnts = [ { label: metric.name, values: pnts } ];

      if (template.graphs && template.graphs[metric.code]) {
        template.graphs[metric.code].update(pnts);
      } else {
        if (!template.graphs) { template.graphs = {}; }

        template.graphs[metric.code] = $graph.epoch({
          type: 'line',
          data: pnts,
          axes: ['left'],
          ticks: { left: 2 },
          margins: { left: 40, right: 5, top: 20, bottom: 20 },
        });

        $graph.append('<h3 class="metric-name">' + metric.name + '</h3>');
      }
    });
  });
});
