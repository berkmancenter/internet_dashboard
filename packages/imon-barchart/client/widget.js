Template.IMonBarchartWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    var mode = Template.currentData().mode;
    var indicators = mode === 'single' ? Template.currentData().y.single.indicator :  Template.currentData().x.multi.indicator;
    var countries = mode === 'single' ? Template.currentData().x.single.indicator : Template.currentData().y.multi.indicator;
    template.subscribe('imon_data_v2', countries, indicators, !Template.currentData().byYear);
    template.subscribe('imon_indicators'); // for provider data
    template.subscribe('imon_indicators_v2');
    template.subscribe('imon_countries_v2');
  });
});

Template.IMonBarchartWidget.onRendered(function() {
  var template = this;
  var redrawn = false;

  var widgetNode = template.firstNode.parentNode.parentNode;
  var $widgetBody = $(widgetNode).find('.widget-body');
  var node = template.find('.barchart');

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
    var height = $widgetBody.innerHeight() - $(node).position().top;
    chart.width(width);
    chart.height(height);
  };


  $(widgetNode).on('gridster:resizestop', function() {
    setChartDims();
    chart.redraw();
  });

  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }

    var yIndicator, xTitle, yTitle;
    var cachedIndicator = Template.currentData().indicator; 

    var data = [];
    var missing = []; // for the error
    var mode_reactive = Template.currentData().mode;

    if(mode_reactive === 'single'){ // Single indicator, multiple countries. Default.

      // 1. Make sure indicator is in right format
      if(!IMonMethods.isAdminName(Template.currentData().y.single.indicator)){
        var adName = IMonMethods.idToAdminName(Template.currentData().y.single.indicator);
        var newData = {
          y: {
            single: {
              indicator: adName
            }
          }
        };
        Template.currentData().set(newData);
      }
      
      // 2. Get the y-axis indicator ID
      yIndicator = IMonIndicators.findOne({ adminName: Template.currentData().y.single.indicator });

      // 3. Get the indicator as an object
      var dataIndicator = IMonIndicatorsD.findOne({ id: yIndicator.id });

      // 4. Change the source in the upper right corner
      if ( !cachedIndicator || cachedIndicator.id !== yIndicator.id){  
        Template.currentData().set({indicator: dataIndicator});
      }

      // 5. Chart Data
      xTitle = 'Countries', yTitle = yIndicator.shortName;

      var IMon = Template.currentData().byYear ? IMonData : IMonRecent;

      IMonCountries.find({ code: {$in: Template.currentData().x.single.indicator } }).forEach(function(country){
        var selector = { countryCode: country.code, indAdminName: Template.currentData().y.single.indicator };

        if(Template.currentData().byYear){
          var chosenYear = Template.currentData().chosenYear;
          selector.$where = function(){ return this.date.getFullYear() === chosenYear; };
       }

        var y = IMon.findOne(selector, { sort: { date: -1 } });
        if (_.isUndefined(y)) { missing.push(country.name); return;  }

        var xValue = country.name, yValue = y.value;

        data.push({
          x: xValue,
          y: yValue,
          code: country.code,
          key: country.code,
          label: yValue.toFixed(yIndicator.precision)
        });
      });

      // 6. Handle errors
      if(missing.length>0){ 
        $(template.find('.barchart-error')).html(getErrorHTML(missing));
        $(template.find('#barchart-error-message')).on('closed.bs.alert', function(){
          setChartDims();
          chart.redraw();
        });
      }
      else{
        $(template.find('#barchart-error-message')).remove(); // if there's an error present from a previous save
      }
    }
    // PLACE LOGIC FOR MODE = 'MULTI' HERE IN AN ELSE CLAUSE

    if(Template.currentData().sorted){ 
      data = _.sortBy(data, 'y'); 
      data.reverse();
    }
    else{
      data = _.sortBy(data, 'x');
    }

    chart.margins(Settings.chart.margins);
    chart.responsive(false);

    chart.draw({
      data: data,
      mode: mode_reactive,
      xAxisTitle: xTitle,
      yAxisTitle: yTitle
    });

    var rotateAxisLabels = function(){
    // make x-axis labels diagonal
    if(data.length===0){ return; }
    var xAxisText = template.findAll('[data-id="xAxis"] text');
    var label = d3.selectAll(xAxisText);
    var longest = _.max(data, function(row){ return row.x.length; }).x.length; // longest number of letters in x-labels
    label.attr('transform', d3.compose.helpers.rotate(-45, {x: longest*1.5, y: longest*3}));
    }

    rotateAxisLabels();
    setChartDims();
    chart.redraw(); // for when diagonal labels are long, since we can't rotate the axes before they even exist/are drawn.

    if(!redrawn){
      rotateAxisLabels();
      setChartDims();
      chart.redraw();
      redrawn = true;
    }

  });
});

function getErrorHTML(missingCountries){
  return '<div class="alert alert-warning" id="barchart-error-message">'
          +'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
          +'<strong><i class="fa fa-exclamation-triangle"></i></strong> No data found for ' + missingCountries
          +'</div>';
}