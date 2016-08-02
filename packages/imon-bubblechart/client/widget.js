Template.IMonBubbleChartWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_indicators_v2');
    template.subscribe('imon_countries_v2');
  });
});

Template.IMonBubbleChartWidget.helpers({
  bubbleSize: function(){ return Template.currentData().z.same ? '' : 'Size: ' + IMonIndicators.findOne({ adminName: Template.currentData().z.indicator }).shortName; },
  isLooping: function(){
    var id = Template.instance().data.widget._id;
    return Session.get(id+'-loop') ? 'shown' : 'hidden';
  }
});

Template.IMonBubbleChartWidget.onRendered(function() {
  var template = this;

  var widgetNode = template.firstNode.parentNode.parentNode;
  var id = widgetNode.getAttribute('data-mid');
  var $widgetBody = $(widgetNode).find('.widget-body');

  var node = template.find('.bubble-chart');
  var yearPlace = template.find('.bubblechart-year');
  var errorPlace = template.find('.bubblechart-error');
  var buttonPlace = template.find('.bubblechart-button');
  var loadingPlace = template.find('.bubblechart-loading');

  var chart = d3.select(node).chart('Compose', function(options) {
    var scales = {
      x: { domain: [_.min(options.xs), _.max(options.xs)] },
      y: { domain: [_.min(options.ys), _.max(options.ys)] },
    };

    var charts = [{
      type: 'Points',
      id: 'dots',
      data: options.data,
      xScale: scales.x,
      yScale: scales.y,
      xJitter: options.xJitter,
      yJitter: options.yJitter,
      labels: true
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
    // 1. Get common years
    var c = Session.get(id+'-common');
    chosen = c[i];

    // 2. Toggle controllers depending on i
    if(i!==0) toggle('#step-backward-button', buttonPlace, false);
    else toggle('#step-backward-button', buttonPlace, true); 

    if(i===c.length-1) toggle('#step-forward-button', buttonPlace, true); 
    else toggle('#step-forward-button', buttonPlace, false);

    // 3. Draw
    draw(chart, Session.get(id+'-hash'), chosen, yearPlace, options, template);

    // 4. Iterate
    Session.set(id+'-current', i);
    var loop = Session.get(id+'-loop');
    i++;

    // 5. End/Continue recursion
    if(i!==c.length || i===c.length && loop){
      i = loop && i===c.length ? 0 : i;
      var playing = Meteor.setTimeout(function(){ play(i, options); }, 1000);
      $('#pause-button', buttonPlace).one('click', function(){
        Meteor.clearTimeout(playing);
        $(this).hide();
        $('#play-button', buttonPlace).show();
      });
    }
    else if(i===c.length && !loop){
      $('#pause-button', buttonPlace).hide(); 
      $('#play-button', buttonPlace).show(); 
      toggle('#step-forward-button', buttonPlace, true); 
    }
  };

  var moveCurrent = function(isForward, options){
    // 1. Get common years and current position
    var common = Session.get(id+'-common');
    var current = Session.get(id+'-current');

    // 2. Calculate difference and new value 
    var diff = isForward ? 1 : -1;
    var newVal = current + diff;

    // 3. Handle errors
    if(newVal >= common.length || newVal<0){ return; }

    // 4. Move
    var chosen = Session.get(id+'-common')[newVal];
    Session.set(id+'-current', newVal);
    draw(chart, Session.get(id+'-hash'), chosen, yearPlace, options, template);

    // 5. Toggle controllers
    if(isForward){
      toggle('#step-backward-button', buttonPlace, false); 
      if(newVal===common.length-1){
        toggle('#step-forward-button', buttonPlace, true); 
      } 
    }
    else{
      toggle('#step-forward-button', buttonPlace, false); 
      if(newVal===0){
        toggle('#step-backward-button', buttonPlace, true); 
      } 
    }
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

      // 2. Initialize chart
      $(loadingPlace).html('');
      $(node).show();

      setChartDims();
      chart.responsive(false);
      chart.margins(Settings.chart.margins);
      var xi = IMonIndicators.findOne({ adminName: xIndicator });
      var yi = IMonIndicators.findOne({ adminName: yIndicator });

      var options = {
        xAxisTitle: xTitle,
        yAxisTitle: yTitle,
        xJitter: currentData.x.jitter,
        yJitter: currentData.y.jitter,
        xs: [xi.min, xi.max],
        ys: [yi.min, yi.max]
      };

      draw(chart, hash, common[common.length-1], yearPlace, options, template);

      var circles = d3.selectAll(template.findAll('circle'));
      circles.on('click', function(d){
       var clicked = d3.select(this); 
       var visibleLabels = d3.selectAll(template.findAll('.chart-label.visible-label'));
       if(clicked.classed('clicked')){
        visibleLabels.each(function(e){
          if(d===e){ d3.select(this).classed('visible-label', false); }
        });
       }
       clicked.classed('clicked', !clicked.classed('clicked'));
      });

      // 3. Set session variables
      Session.set(id+'-current', 0); // Current place
      Session.set(id+'-common', common);
      Session.set(id+'-hash', hash);      

      // 4. Initialize controllers
      $('#play-button', buttonPlace).show();
      $('#loop-button', buttonPlace).show();
      $('#step-forward-button', buttonPlace).show();
      $('#step-backward-button', buttonPlace).show();
      toggle('#step-forward-button', buttonPlace, true);
      toggle('#play-button, #step-backward-button, #loop-button', buttonPlace, common.length === 1 ? true : false);

      // 5. Attach event handlers
      $('#play-button', buttonPlace).click(function(){
        var p = Session.get(id+'-current') === Session.get(id+'-common').length - 1 ? 0 : Session.get(id+'-current'); 
        $(this).hide();
        play(p, options);
        $('#pause-button', buttonPlace).show();
      });

      $('#step-forward-button', buttonPlace).click(function(){
        moveCurrent(true, options);
      });

      $('#step-backward-button', buttonPlace).click(function(){
        moveCurrent(false, options);
      });
      $('#loop-button', buttonPlace).off();
      $('#loop-button', buttonPlace).click(function(){
        var enabled = Session.get(id+'-loop');
        Session.set(id+'-loop', !enabled);
      });
    });
  });
});

function createError(errorPlace, errorString){
  $(errorPlace).html('<div class="alert alert-warning" id="bubblechart-error-message">'
          + '<i class="fa fa-exclamation-triangle"></i> ' + errorString
          +'</div>');
}

function draw(chart, hash, chosen, yearPlace, options, template){
  $(yearPlace).text(chosen);
  options.data = hash[chosen];
  chart.draw(options);
  var clicked = d3.selectAll(template.findAll('circle.clicked'));
  var labels = d3.selectAll(template.findAll('.chart-label'));
  clicked.each(function(d){
    labels.each(function(e){
      if(d===e){
         d3.select(this).classed('visible-label', true);
      }
    });
  });
}

function toggle(selector, context, disable){
  $(selector, context).prop('disabled', disable);
}
