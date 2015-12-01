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

Template.GSMAPrepaidWidget.helpers({
  currentValue: function() {
    var datum = GSMAData.findOne({
      geoCode: Template.currentData().country.iso3,
      metric: Settings.metric,
      attr: Settings.attr,
      current: { $exists: true }
    });
    if (datum) {
      return Math.round(datum.current * 1000) / 10.0 + '%';
    }
  },
  trendLabel: function() {
    var datum = GSMAData.findOne({
      geoCode: Template.currentData().country.iso3,
      metric: Settings.metric,
      attr: Settings.attr,
    }, { sort: { start: 1 }});
    if (datum) {
      return 'Last ' + moment(datum.start).fromNow(true).replace(/^a /, ' ');
    } else {
      return '';
    }
  }
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
        axes: [],
        margins: { left: 0, right: 0, top: 3, bottom: 3 },
      });
    }
  });
});
