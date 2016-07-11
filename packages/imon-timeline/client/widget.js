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
  var widgetNode = template.firstNode.parentNode.parentNode;
  var $widgetBody = $(widgetNode).find('.widget-body');

  var chartSingle = d3.select(chartSinglePlace).chart('Compose', function(options){
  var scales = {
    x: d3.time.scale().domain([options.minDate, options.maxDate]),
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
  var ticks = options.years > 10 ? 10 : options.years < 5 ? 5 : options.years;
  var xAxis = d3c.axis('xAxis', {scale: scales.x, ticks: ticks});
  var legend = d3c.legend({charts: ['results']});

    return [
      [d3c.layered(charts), legend],
      xAxis
    ];
  });

  var setDimensions = function(ch){
    var height = $widgetBody.innerHeight() - 50 - $(chartSinglePlace.parentNode).position().top;
    var width = parseInt($(chartSinglePlace).css('width').replace('px', ''));
    ch.height(height);
    ch.width(width);
  };

  template.autorun(function(){
    if (!template.subscriptionsReady()) { return; }

    // SHARED CODE
    var minDate = new Date("9999");
    var maxDate = new Date("1000");
    var years = [];
    var d = [];

    /**
      ========================================
      1. SINGLE INDICATOR, MULTIPLE COUNTRIES
      ========================================
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

      // 2. Draw
      $(chartSinglePlace).show();
      //// Variables
      var countryList = Template.currentData().country;
      var indName = currId;
      var minValue = IMonIndicators.findOne({ adminName: currId }).max;
      var maxValue = IMonIndicators.findOne({ adminName: currId }).min;
      var missingCountries = [];

      //// Get data
      for(var i=0; i<countryList.length; i++){
        var countryName = IMonCountries.findOne({ code: countryList[i] }).name;
        var tempObj = {
          key: countryList[i],
          name: countryName
        };
        var points = [];
        var data = IMonData.find({
          countryCode: countryList[i],
          indAdminName: indName
        }, { sort: { date: 1 } }).forEach(function(d){
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
          tempObj.values = points;
          d.push(tempObj);
        }
        else{
          missingCountries.push(countryName);
        }
      }
      //// Draw chart
      setDimensions(chartSingle);
      chartSingle.responsive(false);
      chartSingle.margins({ top: 10, bottom: 0, left: 10, right: 30 });

      if(missingCountries.length > 0){ // some data not found/enough for a line
        var missingString = missingCountries.join(', ');
        var error = template.find('.timeline-error');
        $(error).html('<div class="alert alert-warning" id="timeline-error-message">'
          +'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
          + '<i class="fa fa-exclamation-triangle"></i> No trend data found for ' + missingString
          +'</div>');
          setDimensions(chartSingle);
        $(template.find('#timeline-error-message')).on('closed.bs.alert', function () {
          setDimensions(chartSingle);
          chartSingle.redraw();
        });
      }
      else{
        $(template.find('.timeline-error')).empty();
      }

      if(d.length===0) { return; } // no data at all
      chartSingle.draw({ data:d, minDate: minDate, maxDate: maxDate, minValue: minValue, maxValue: maxValue, years: years.length });
    }
    /**
      ========================================
      2. SINGLE COUNTRY, MULTIPLE INDICATORS
      ========================================
    **/
    else if(Template.currentData().mode === 'singleCountry'){
      $(chartSinglePlace).hide();
      console.log('Single country!');
    }

    // Append titles (labels) to circles (built-in d3.compose labels with a lot of data points + constant resizing/redrawing causes memory/CPU usage problems on the client)
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


