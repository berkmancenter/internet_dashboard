Template.IMonScatterWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    var indicators = [
      Template.currentData().x.indicator,
      Template.currentData().y.indicator
    ];
    template.subscribe('imon_data', 'all', indicators);
    template.subscribe('imon_countries');
  });
});

Template.IMonScatterWidget.onRendered(function() {
  var template = this;
  var node = template.find('.scatter-chart');
  var chart = d3.select(node).chart('Compose', function(options) {
    var scales = {
      x: { data: options.data, key: 'x' },
      y: { data: options.data, key: 'y' }
    };

    var charts = [{
      type: 'Dots',
      id: 'dots',
      data: options.data,
      xScale: scales.x,
      yScale: scales.y,
      labels: {
        offset: 3
      }
    }];

    var title = d3c.title('Custom Chart');
    var xAxis = d3c.axis('xAxis', {scale: scales.x, ticks: 3});
    var yAxis = d3c.axis('yAxis', {scale: scales.y, ticks: 3});
    var xAxisTitle = d3c.axisTitle(options.xAxisTitle);
    var yAxisTitle = d3c.axisTitle(options.yAxisTitle);

    return [
      //title,
      [yAxisTitle, yAxis, d3c.layered(charts)],
      xAxis,
      xAxisTitle
    ];
  });
  chart.width(400);
  chart.height(250);
  chart.margins({ top: 30, bottom: 0, right: 20 });

  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }
    var xIndicator = Template.currentData().x.indicator;
    var yIndicator = Template.currentData().y.indicator;

    var data = [];
    IMonCountries.find().forEach(function(country) {
      var x = IMonData.findOne({ countryCode: country.code, name: xIndicator });
      var y = IMonData.findOne({ countryCode: country.code, name: yIndicator });
      if (_.isUndefined(x) || _.isUndefined(y)) { return; }

      data.push({ x: x.value, y: y.value, code: country.code, label: country.name });
    });

    chart.draw({ data: data, xAxisTitle: xIndicator, yAxisTitle: yIndicator });
  });
});
