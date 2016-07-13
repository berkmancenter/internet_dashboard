Template.IMonTimelineWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_indicators'); // for provider data
    template.subscribe('imon_countries_v2');
    template.subscribe('imon_indicators_v2');
    template.subscribe('imon_data_v2', Template.currentData().country, Template.currentData().indicatorName, false);
  });
});
Template.IMonTimelineWidget.helpers({
  title: function (){
  return Template.currentData().mode === 'singleIndicator' ? 
    IMonIndicators.findOne({ adminName: Template.currentData().indicatorName }).shortName :
    IMonCountries.findOne({ code: Template.currentData().country }).name; 
}
});

Template.IMonTimelineWidget.onRendered(function() {
  var template = this;
  var chartSinglePlace = template.find('.chart-single');
  var chartMultiPlace = template.find('.chart-multi');
  var widgetNode = template.firstNode.parentNode.parentNode;
  var $widgetBody = $(widgetNode).find('.widget-body');
  var error = template.find('.timeline-error');

  var createChartNode = function(selector, code){
    if($(template.find('#chart-multi-' + code)).length===0){
      $(selector).append('<div class="chart-multi col-xs-8" id="chart-multi-' + code +'"></div>'
        + '<div class="label-multi col-xs-4" id="label-multi-' + code + '"></div>');
    }
    return { chart: '#chart-multi-' + code, label: '#label-multi-' + code };
  };

  var setDimensions = function(ch, numberOfCharts, sel, redraw){
    var height = ($widgetBody.innerHeight() - 50 - $(chartSinglePlace.parentNode).position().top)/numberOfCharts;
    var width = parseInt($(sel).css('width').replace('px', ''));
    ch.height(height);
    ch.width(width);
    if(redraw) ch.redraw();
  };

  var setMultiDimensions = function(multiCharts){ // set dimensions for multiCharts array + redraw
    for(var i=0; i<multiCharts.length; i++){
      setDimensions(multiCharts[i].chart, multiCharts.length, multiCharts[i].chartNode, true);
    }
  };

  var chartSingle = d3.select(chartSinglePlace).chart('Compose', handleChart);

  template.autorun(function(){
    if (!template.subscriptionsReady()) { return; }

    // SHARED CODE
    var minDate = new Date("9999");
    var maxDate = new Date("1000");
    var currentMode = Template.currentData().mode;
    var minValue;
    var maxValue;
    var missing = [];
    var years = [];
    var d = [];
    var multiCharts = [];
    var nodes = currentMode === 'singleIndicator' ? { show: chartSinglePlace, hide: chartMultiPlace } : { show: chartMultiPlace, hide: chartSinglePlace };
    $(nodes.show).show();
    $(nodes.hide).hide();
    $(chartMultiPlace).empty();

    var getData = function(){ // returns nothing
      var object = currentMode === 'singleIndicator' ?
       { single: Template.currentData().indicatorName, array: Template.currentData().country, arrKey: 'countryCode', singleKey: 'indAdminName' } :
       { single: Template.currentData().country, array: Template.currentData().indicatorName, arrKey: 'indAdminName', singleKey: 'countryCode' };
      if(currentMode==='singleIndicator'){
        minValue = IMonIndicators.findOne({ adminName: object.single }).max;
        maxValue = IMonIndicators.findOne({ adminName: object.single }).min;
      }
      for(var i=0; i<object.array.length; i++){
        var name = currentMode === 'singleIndicator' ? IMonCountries.findOne({ code: object.array[i] }).name : IMonIndicators.findOne({ adminName: object.array[i] }).shortName;
        if(currentMode!=='singleIndicator'){
          minValue = IMonIndicators.findOne({ adminName: object.array[i] }).max;
          maxValue = IMonIndicators.findOne({ adminName: object.array[i] }).min;
        }
        var obj = {
          key: object.array[i],
          name: name
        };
        var sel = {};
        var points = [];
        sel[object.arrKey] = object.array[i];
        sel[object.singleKey] = object.single;
        IMonData.find(sel, { sort: { date: 1 } }).forEach(function(d){
          var t = {
            x: d.date,
            y: d.value,
            code: d.value
          };
          if(years.indexOf(d.date.getFullYear())===-1) years.push(d.date.getFullYear());
          if(d.date < minDate) minDate = d.date;
          if(d.date > maxDate) maxDate = d.date;
          if(d.value < minValue) minValue = d.value;
          if(d.value > maxValue) maxValue = d.value;
          points.push(t);
        });
        if(points.length>=2 && !allEqual(_.pluck(points, 'x'))){
          obj.values = points;
          if(currentMode==='singleIndicator'){ d.push(obj); }
          else{
            var tempNode = createChartNode(template.find('.chart-multi'), i);
            var chartNode = template.find(tempNode.chart);
            var labelNode = template.find(tempNode.label); 
            var tempChart = d3.select(chartNode).chart('Compose', handleChart);
            multiCharts.push({ chart: tempChart, chartNode: chartNode, labelNode: labelNode, label: name, options: {
              data: [obj],
              xAxis: false, 
              multi: true,
              minValue: minValue,
              maxValue: maxValue
            }});
          }
        }
        else{
          missing.push(name);
        }
      }
    }

    /**
      FIRST, GET DATA REGARDLESS OF MODE
    **/
    getData();

    /**
      SPECIAL INSTRUCTIONS FOR EACH MODE (DRAWING, ERROR HANDLING)
    **/
    if(Template.currentData().mode === 'singleIndicator'){
      // 1. Put the source in the top right corner of the widget
      var cachedIndicator = Template.currentData().indicator;
      var currId = Template.currentData().indicatorName;
      if(!cachedIndicator || IMonIndicators.findOne({ id: cachedIndicator.id }).adminName !== currId){
        // done this way until provider/source data is in IndicatorsDev/equiv. 
        var newId = IMonIndicators.findOne({ adminName: currId }).id;
        Template.currentData().set({ indicator: IMonIndicatorsD.findOne({ id: newId })});
      }     

      setDimensions(chartSingle,1,chartSinglePlace,false);
      chartSingle.responsive(false);
      chartSingle.margins(Settings.margins);
      if(missing.length > 0){ // some data not found/enough for a line
        createError(missing, error, function(){
          return setDimensions(chartSingle,1,chartSinglePlace, true);
        });
      }
      else{
        $(error).empty();
      }
      if(d.length===0) { return; } // no data at all
      chartSingle.draw({ data: d, xAxis: true, multi: false, minDate: minDate, maxDate: maxDate, minValue: minValue, maxValue: maxValue, years: years.length });
    }
    else{
      if(Template.currentData().indicator){ Template.currentData().set({ indicator: undefined }); }
      for(var i=0; i<multiCharts.length; i++){
        var one = multiCharts[i];
        if(i===multiCharts.length-1) one.options.xAxis = true;
        setDimensions(one.chart, multiCharts.length, one.chartNode, false);
        one.chart.responsive(false);
        one.chart.margins(Settings.margins);
        $(one.labelNode).text(one.label);
        one.options.minDate = minDate;
        one.options.maxDate = maxDate;
        one.options.years = years.length;
        one.chart.draw(one.options);
      }
      if(missing.length>0){
        createError(missing, error, function(){
          return setMultiDimensions(multiCharts);
        });
      }
      else{
        $(error).empty();
      }
      
      $(template.findAll('.chart-index-0, circle')).css('fill', Template.currentData().color);
      $(template.findAll('.chart-index-0, circle')).css('stroke', Template.currentData().color);
    }

    /**
      APPEND TITLES (labels) TO CIRCLES
      (built-in d3.compose labels with a lot of data points + constant resizing/redrawing causes memory/CPU usage problems on the client)
    **/
    var circles = d3.selectAll(template.findAll('circle'));
    circles.append('svg:title').text(function(d){ 
      return d.y >= 1000000 ? (Math.round(d.y/1000000*100)/100).toLocaleString() + 'M' : (Math.round(d.y * 100) / 100).toLocaleString();
    });

  });
});

function allEqual(results){
  var x = results[0];
  var equal = true;
  for(var i=0; i<results.length; i++){
    if(results[i] !== x){
      equal = false;
      break;
    }
  }
  return equal;
}


function createError(array, errorPlace, setDims){
  var missingString = array.join(', ');
  $(errorPlace).html('<div class="alert alert-warning" id="timeline-error-message">'
          +'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
          + '<i class="fa fa-exclamation-triangle"></i> No trend data found for ' + missingString
          +'</div>');
  setDims();
  $('#timeline-error-message', errorPlace).on('closed.bs.alert', setDims);
}

function handleChart(options){
  var ticks; 
  var minDate = options.minDate;
  var maxDate = options.maxDate;

  if(options.years === 2){
    ticks = 3;
    minDate = new Date(options.minDate.getTime() - ONE_MONTH);
    maxDate = new Date(options.maxDate.getTime() + ONE_MONTH);
  }
  else if(options.years === 1){
    ticks = 5;
  }
  else{
    ticks = options.years;
  }

  var scales = {
    x: d3.time.scale().domain([minDate, maxDate]),
    y: { domain: [options.minValue, options.maxValue] }
  };
  var charts = [
    d3c.lines('results', {
      data: options.data,
      xScale: scales.x,
      yScale: scales.y
    }),
    {
      type: 'Points',
      id: 'points',
      data: options.data,
      xScale: scales.x,
      yScale: scales.y,
      rValue: 3
    }
  ];
  var xAxis;
  if(options.xAxis) xAxis = d3c.axis('xAxis', {scale: scales.x, ticks: ticks});
  var legend;
  if(!options.multi) legend = d3c.legend({charts: ['results']});

    return [
      [d3c.layered(charts), legend],
      xAxis
    ];
  }

