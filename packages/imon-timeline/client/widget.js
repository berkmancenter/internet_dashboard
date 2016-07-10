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
  indicator: function() { return IMonIndicators.findOne({ adminName: Template.currentData().indicatorName }).shortName; }
});

Template.IMonTimelineWidget.onRendered(function() {
  var template = this;
  var redrawn = false;
  var chartPlace = template.find('.current-data');
  var widgetNode = template.firstNode.parentNode.parentNode;
  var $widgetBody = $(widgetNode).find('.widget-body');
  var createChartNode = function(code){
    /**
    PARAMETERS: 
      - code: indicator adminName (for singleCountry) or country code (for singleIndicator)
    RETURNS:
      - { chart: selector string for the chart, label: selector string for external label }
    **/
    if($(template.find('#chart-' + code)).length == 0){
      $(chartPlace).append('<div class="col-xs-12 whole-chart" id="whole-'+ code +'">' +
        '<div class="trend-label" id="label-' + code + '"></div>'
        + '<div class="epoch chart" id="chart-' + code + '"></div><hr></div>');
    }

    return { whole: '#whole-' + code, chart: '#chart-' + code, label: '#label-' + code };
  };

  template.autorun(function(){
    if (!template.subscriptionsReady()) { return; }

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
      //// a. Remove any previous drawings
      $(chartPlace).empty();

      //// b. Assign variables
      var countryList = Template.currentData().country;
      var indName = currId;
      var minDate = new Date("9999");
      var maxDate = new Date("1000");
      var minValue = IMonIndicators.findOne({ adminName: currId }).max;
      var maxValue = IMonIndicators.findOne({ adminName: currId }).min;
      var years = [];
      var d = [];
      //// c. Get data
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
            code: d.value,
            key: d.value,
            label: d.value.toFixed(0)
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
      }

      //// d. Draw chart
      if(d.length===0) { return; } // No data at all
      var node = createChartNode('singleIndicator');
      var chartNode = template.find(node.chart);
      var chart = d3.select(chartNode).chart('Compose', function(options){
        var scales = {
          x: d3.time.scale().domain([minDate, maxDate]),
          y: { domain: [minValue, maxValue] }
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
            rValue: 5,
            labels: {}
          }
        ];
        var ticks = years.length > 10 ? 10 : years.length < 5 ? 5 : years.length;
        var xAxis = d3c.axis('xAxis', {scale: scales.x, ticks: ticks});
        var legend = d3c.legend({charts: ['results']});

        return [
          [d3c.layered(charts), legend],
          xAxis
        ];
      });
      
      var width = parseInt($(chartNode).css('width').replace('px', ''));
      var height = $widgetBody.innerHeight() - 90;
      chart.width(width);
      chart.margins({ top: 30, bottom: 0, left: 35 });
      chart.height(height);
      chart.draw({ data:d });
    }
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


