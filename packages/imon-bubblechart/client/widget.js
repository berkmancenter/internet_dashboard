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
  var id = widgetNode.getAttribute('data-mid');
  var $widgetBody = $(widgetNode).find('.widget-body');
  var loadingPlace = template.find('.bubblechart-loading');
  var errorPlace = template.find('.bubblechart-error');
  var yearPlace = template.find('.bubblechart-year');
  var buttonPlace = template.find('.bubblechart-button');
  var playing; // variable for the timeout

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
      yJitter: options.yJitter
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

  var play = function(i, options){
    var c = Session.get(id+'-common');
    chosen = c[i];
    draw(chart, Session.get(id+'-hash'), chosen, yearPlace, options);
    var circles = d3.selectAll(template.findAll('circle'));
    circles.append('svg:title').text(function(d){ 
       return d.label;
    });
    Session.set(id+'-current', i);
    i++;
    if(i!==c.length) { playing = Meteor.setTimeout(function(){ play(i, options); }, 1000);  }
    else{ $('#pause-button', buttonPlace).hide(); $('#play-button', buttonPlace).show();}
  };

  var moveCurrent = function(isForward, options){
    var common = Session.get(id+'-common');
    var current = Session.get(id+'-current');
    var diff = isForward ? 1 : -1;
    var newVal = current + diff;
    if(newVal >= common.length || newVal<0){ return; }
    var chosen = Session.get(id+'-common')[newVal];
    Session.set(id+'-current', newVal);
    draw(chart, Session.get(id+'-hash'), chosen, yearPlace, options);
    var circles = d3.selectAll(template.findAll('circle'));
    circles.append('svg:title').text(function(d){ 
       return d.label;
    });
  };

  template.autorun(function() {
    $(errorPlace).empty();
    if (!template.subscriptionsReady()) { return; }
    $(template.findAll('.animation-button')).hide();
    $(template.findAll('.animation-button')).off();
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
      Session.set(id+'-current', 0); // Current place
      Session.set(id+'-common', common);
      Session.set(id+'-hash', hash);
      $('#play-button', buttonPlace).show();
      $('#step-forward-button', buttonPlace).show();
      $('#step-backward-button', buttonPlace).show();
      $('#play-button', buttonPlace).click(function(){
        var p = Session.get(id+'-current') === Session.get(id+'-common').length - 1 ? 0 : Session.get(id+'-current'); 
        play(p, options);
        $(this).hide();
        $('#pause-button', buttonPlace).show();
      });
      $('#pause-button', buttonPlace).click(function(){
        Meteor.clearTimeout(playing);
        $(this).hide();
        $('#play-button', buttonPlace).show();
      });
      $('#step-forward-button', buttonPlace).click(function(){
        moveCurrent(true, options);
      });
      $('#step-backward-button', buttonPlace).click(function(){
        moveCurrent(false, options);
      });

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
