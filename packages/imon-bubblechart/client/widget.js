Template.IMonBubbleChartWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    var indicators = [
      Template.currentData().x.indicator,
      Template.currentData().y.indicator
    ];
    if(!Template.currentData().z.same) indicators.push(Template.currentData().z.indicator);
    template.subscribe('imon_data_v2', 'all', indicators, true);
    template.subscribe('imon_indicators_v2');
    template.subscribe('imon_countries_v2');
  });
});

Template.IMonBubbleChartWidget.helpers({
  bubbleSize: function(){ return Template.currentData().z.same ? '' : 'Size: ' + IMonIndicators.findOne({ adminName: Template.currentData().z.indicator }).shortName; }
});

Template.IMonBubbleChartWidget.onRendered(function() {
  var template = this;
  var node = template.find('.bubble-chart');
  var widgetNode = template.firstNode.parentNode.parentNode;
  var $widgetBody = $(widgetNode).find('.widget-body');

  var chart = d3.select(node).chart('Compose', function(options) {
    var xs = _.pluck(options.data, 'x'), ys = _.pluck(options.data, 'y');

    var scales = {
      x: { domain: [_.min(xs), _.max(xs)] },
      y: { domain: [_.min(ys), _.max(ys)] },
    };

    var charts = [{
      type: 'Points',
      id: 'dots',
      data: options.data,
      xScale: scales.x,
      yScale: scales.y,
      xJitter: options.xJitter,
      yJitter: options.yJitter,
      rValue: Settings.chart.defaultSize
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
    var width = parseInt($(node).css('width').replace('px', '')) - Settings.chart.padding.right;
    var height = $widgetBody.outerHeight() - Settings.chart.padding.bottom;
    chart.width(width);
    chart.height(height);
  };

  var redrawn = false;
  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }
    var xIndicator = Template.currentData().x.indicator;
    var yIndicator = Template.currentData().y.indicator;
    var xTitle = IMonIndicators.findOne({ adminName: xIndicator }).shortName;
    var yTitle = IMonIndicators.findOne({ adminName: yIndicator }).shortName; 

    if (Template.currentData().x.log) {
      xTitle = 'Log ' + xTitle;
    }
    if (Template.currentData().y.log) {
      yTitle = 'Log ' + yTitle;
    }


    var data = [];
    IMonCountries.find(countrySelector(Template.currentData().countries)).forEach(function(country) {
      var x = IMonRecent.findOne({ countryCode: country.code, indAdminName: xIndicator });
      var y = IMonRecent.findOne({ countryCode: country.code, indAdminName: yIndicator });
      if (_.isUndefined(x) || _.isUndefined(y)) { return; }

      var xValue = x.value, yValue = y.value, r;

      if (Template.currentData().x.log && xValue > 0) {
        xValue = Math.log(xValue);
      }
      if (Template.currentData().y.log && yValue > 0) {
        yValue = Math.log(yValue);
      }

      if(Template.currentData().z.same){
        r = Settings.chart.defaultSize;
      }
      else{ // zIndicator here can't be undefined
        var zIndicator = IMonIndicators.findOne({ adminName: Template.currentData().z.indicator });
        var zMax = zIndicator.max;
        var sizeVal = IMonRecent.findOne({ countryCode: country.code, indAdminName: zIndicator.adminName });
        if(_.isUndefined(sizeVal)) { return; }
        r = ((sizeVal.value * Settings.chart.maxSize)/zMax) + Settings.chart.minSize;
      }
      data.push({
        x: xValue,
        y: yValue,
        code: country.code,
        key: country.code,
        label: country.name,
        r: r
      });
    });

    setChartDims();
    chart.margins(Settings.chart.margins);
    chart.responsive(false);

    chart.draw({
      data: data,
      xAxisTitle: xTitle,
      yAxisTitle: yTitle,
      xJitter: Template.currentData().x.jitter,
      yJitter: Template.currentData().y.jitter
    });

    var circles = d3.selectAll(template.findAll('circle'));
    circles.append('svg:title').text(function(d){ 
      return d.label;
    });

  });
});

function countrySelector(countries){
  var sel = {};
  if(_.isArray(countries)){ // if it's one country, it will also be in an array
    sel.code = { $in: countries };
  }
  return sel;
}
