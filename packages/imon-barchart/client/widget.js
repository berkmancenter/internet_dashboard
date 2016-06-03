Template.IMonBarchartWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    var mode = Template.currentData().mode;
    var indicators = mode === 'single' ? [ Template.currentData().y.single.indicator ] :  Template.currentData().x.multi.indicator ;
    template.subscribe('imon_data', 'all', indicators,'id');
    template.subscribe('imon_indicators');
    template.subscribe('imon_countries');
  });
});

Template.IMonBarchartWidget.onRendered(function() {
  var template = this;
  var node = template.find('.barchart');
  var widgetNode = template.firstNode.parentNode.parentNode;
  var $widgetBody = $(widgetNode).find('.widget-body');
  var chart = d3.select(node).chart('Compose', function(options) {
    var xs = _.pluck(options.data, 'x'), ys = _.pluck(options.data, 'y');

    var scales = options.mode === 'single'? {
      x: { domain: xs, type: 'ordinal', adjacent: true },
      y: { domain: [0, _.max(ys)] }
    } : {
      x: { domain: xs, type: 'ordinal', adjacent: true},
      y: { domain: [0, 100] }
    };

    var charts = [{
      type: 'Bars',
      id: 'bars',
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
      [yAxisTitle, yAxis, d3c.layered(charts)],
      xAxis,
      xAxisTitle
    ];
  });
  

  var setChartDims = function() {
    var width = $widgetBody.outerWidth() - Settings.chart.padding.right;
    var height = $widgetBody.outerHeight() - Settings.chart.padding.bottom;
    chart.width(width);
    chart.height(height);
  };

  $(widgetNode).on('gridster:resizestop', function() {
    setChartDims();
    chart.redraw();
  });

  var redrawn = false;
  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }
    var yIndicator;
    var xTitle;
    var yTitle; 

    var data = [];
    var mode_reactive = Template.currentData().mode;
    if(mode_reactive === 'single'){
      yIndicator = Template.currentData().y.single.indicator;
      xTitle = 'Countries';
      yTitle = IMonIndicators.findOne({ id: yIndicator }).shortName;
      IMonCountries.find({ code: {$in: Template.currentData().x.single.indicator } }).forEach(function(country) {
        var y = IMonData.findOne({ countryCode: country.code, sourceId: yIndicator });
        if (_.isUndefined(y)) { return; }

        var xValue = country.name, yValue = y.value;

        data.push({
          x: xValue,
          y: yValue,
          code: country.code,
          key: country.code,
          label: yValue
        });
      });
    }
    else{
      yIndicator = Template.currentData().y.multi.indicator;
      yTitle = IMonCountries.findOne({ code: yIndicator }).name;
      IMonData.find({ countryCode: yIndicator, sourceId: { $in: Template.currentData().x.multi.indicator } }).forEach(function(field){
        var yValue = Math.round(field.percent * 100).toFixed(2);
        var xValue = IMonIndicators.findOne({ id: field.sourceId }).shortName;

        data.push({
          x: xValue,
          y: yValue,
          code: field.id,
          key: field.id,
          label: yValue
        });
      });
    }


    chart.margins(Settings.chart.margins);
    chart.responsive(false);

    chart.draw({
      data: data,
      mode: mode_reactive,
      xAxisTitle: xTitle,
      yAxisTitle: yTitle
    });

    // make x-axis labels diagonal
    var xAxisText = template.findAll('[data-id="xAxis"] text');
    var label = d3.selectAll(xAxisText);
    var longest = _.max(data, function(row){ return row.x.length; }).x.length; // longest number of letters in x-labels
    label.attr('transform', d3.compose.helpers.rotate(-45, {x: longest*1.5, y: longest*3}));

    // This is a hacky way to get the chart to fit the widget on first draw
    // because it wouldn't throw the draw event correctly.
    if (!redrawn) {
      setChartDims();
      chart.redraw();
      redrawn = true;
    }
  });
});
