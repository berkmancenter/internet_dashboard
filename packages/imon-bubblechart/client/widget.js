Template.IMonBubbleChartWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
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


  template.autorun(function() {
    var loadingPlace = template.find('.bubblechart-loading');
    var errorPlace = template.find('.bubblechart-error');
    var yearPlace = template.find('.bubblechart-year');
    var buttonPlace = template.find('.bubblechart-button');
    $(errorPlace).empty();
    if (!template.subscriptionsReady()) { return; }
    $(node).hide(); 
    var xIndicator = Template.currentData().x.indicator;
    var yIndicator = Template.currentData().y.indicator;
    var zIndicator = Template.currentData().z.indicator;
    var xTitle = IMonIndicators.findOne({ adminName: xIndicator }).shortName;
    var yTitle = IMonIndicators.findOne({ adminName: yIndicator }).shortName; 

    if (Template.currentData().x.log) {
      xTitle = 'Log ' + xTitle;
    }
    if (Template.currentData().y.log) {
      yTitle = 'Log ' + yTitle;
    }

    var indicators = Template.currentData().z.same ? [xIndicator, yIndicator] : [xIndicator, yIndicator, zIndicator];
    var currentData = Template.currentData();

    $(loadingPlace).html('<i class="fa fa-spinner fa-pulse"></i> Processing data...');

    Meteor.call('getData', { indAdminName: { $in: indicators } }, currentData.x.indicator, currentData.y.indicator, currentData.z.same, currentData.z.indicator, currentData.x.log, currentData.y.log, function(error, result){
      var common = result.common, hash = result.hash;
      // 1. Error handling
      if(common.length===0){
        createError(errorPlace, 'No common years found between the selected indicators.'); 
        $(loadingPlace).text('');
        $(yearPlace).text('');
        return;
     }
      $(loadingPlace).html('');
      $(node).show();
      setChartDims();
      chart.margins(Settings.chart.margins);
      chart.responsive(false);
      var chosen = common[0];
      var options = {
        xAxisTitle: xTitle,
        yAxisTitle: yTitle,
        xJitter: currentData.x.jitter,
        yJitter: currentData.y.jitter
      };
      draw(chart, hash, common[0], yearPlace, options);
      var play = function(i){
        chosen = common[i];
        draw(chart, hash, chosen, yearPlace, options);
        var circles = d3.selectAll(template.findAll('circle'));
          circles.append('svg:title').text(function(d){ 
            return d.label;
          });
        i++;
        if(i!==common.length) Meteor.setTimeout(function(){ play(i); }, 1000);
      };

      $(buttonPlace).html('<button class="animation-button" id="play-button"><i class="fa fa-play-circle"></i></button>');
      $(template.find('#play-button')).click(function(){ play(0); });

      var circles = d3.selectAll(template.findAll('circle'));
      circles.append('svg:title').text(function(d){ 
        return d.label;
      });
    });
  });
});


function createError(errorPlace, errorString){
  $(errorPlace).html('<div class="alert alert-warning" id="bubblechart-error-message">'
          + '<i class="fa fa-exclamation-triangle"></i> ' + errorString
          +'</div>');
}

function draw(chart, hash, chosen, yearPlace, options){
  $(yearPlace).text(chosen);
  options.data = hash[chosen];
  chart.draw(options);
}
