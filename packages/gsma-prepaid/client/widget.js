Template.GSMAPrepaidWidget.onCreated(function() {
  var template = this;

  template.autorun(function() {
    var country = Template.currentData().country;
    if (country) {
      template.subscribe('gsma_data', country.iso3,
          Settings.metric, Settings.attr);
    }
  });
});

Template.GSMAPrepaidWidget.onRendered(function() {
  var template = this;
  var hideGraph = function($graph) {
    $graph.find('svg').hide();
    if ($graph.find('.no-data').length === 0) {
      $graph.append('<p class="no-data">No data available.</p>');
    }
  };

  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    var $graph = template.$('.prepaid-connections');

    var data = GSMAData.find({
      geoCode: template.data.country.iso3,
      metric: Settings.metric,
      attr: Settings.attr
    }).fetch();
    if (_.isEmpty(data)) {
      hideGraph($graph);
      return;
    } else {
      $graph.find('.no-data').remove();
      $graph.find('svg').show();
    }

    var pnts = _.map(data, function(d) { return { x: d.start, y: d.value }; });
    pnts = [ { label: 'Prepaid Connections', values: pnts } ];

    if (template.graph) {
      template.graph.update(pnts);
    } else {
      template.graph = $graph.epoch({
        type: 'line',
        data: pnts,
        axes: ['left', 'bottom'],
        ticks: { left: 2, bottom: 3 },
        tickFormats: {
          left: function(d) { return d + '%'; },
          bottom: function(d) { return moment(d).fromNow(); }
        },
        margins: { left: 50, right: 15, top: 5, bottom: 20 },
      });
    }
  });
});
