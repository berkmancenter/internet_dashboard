Template.IMonValuetrendWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_indicators'); // for provider data
    template.subscribe('imon_countries_v2');
    template.subscribe('imon_indicators_v2');
    template.subscribe('imon_data_v2', Template.currentData().country, Template.currentData().indicatorName, false);
  });
});

Template.IMonValuetrendWidget.helpers({
  countryName: function() { return IMonCountries.findOne({ code: Template.currentData().country }).name; },
  indicator: function() { return IMonIndicators.findOne({ adminName: Template.currentData().indicatorName }).shortName; },
  currentValue: function() {
    var date;
    var val;
    var found = false;
    IMonData.find({ 
      countryCode: Template.currentData().country,
      indAdminName: Template.currentData().indicatorName 
    }, { sort: { date: -1 }, limit: 1}).forEach(function(d){ // only one result anyway
      found = true;
      val = d.value;
    });
    val = val >= 1000000 ? (Math.round(val/1000000*100)/100).toLocaleString() + 'M' : (Math.round(val * 100) / 100).toLocaleString();
    var dispClass = IMonIndicators.findOne({ adminName: Template.currentData().indicatorName }).displayClass;
    val = (dispClass && dispClass in Settings.suffix) ? val + '<span class="display-suffix">' + Settings.suffix[dispClass]  + '</span>' : val;
    return found ? val : '<p class="no-data"> No data found.</p>';
  },
  trendLabel: function() {
    var res = [];
    res = IMonData.find({
      countryCode: Template.currentData().country,
      indAdminName: Template.currentData().indicatorName
    }, { sort: { date: 1 } }).fetch();
    if(res.length>0){
      var min = res[0].date;
      var max = res[res.length - 1].date;
      var minYear = min.getFullYear();
      var maxYear = max.getFullYear();
      if(res.length>1 && !allEqual([min.getTime(),max.getTime()])){
        return minYear === maxYear ? 'From ' + Settings.months[min.getMonth()] + ' to ' + Settings.months[max.getMonth()] + ' ' + minYear : 'From ' + minYear + ' to ' + maxYear;
      }
    }
    return ''; 
  }
});

Template.IMonValuetrendWidget.onRendered(function() {
  var template = this;
  
  var showDate = function(ms, graph){
    var toDate = new Date(ms);
    var toYear = toDate.getFullYear();
    $(template.find('svg')).hide();
    $(graph).append('<p class="no-data one-data" title="No trend data available.">From ' + toYear + '</p>');
  }

  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }
    var cachedIndicator = Template.currentData().indicator;
    var currId = Template.currentData().indicatorName;
    if(!cachedIndicator || IMonIndicators.findOne({ id: cachedIndicator.id }).adminName !== currId){
      // done this way until provider/source data is in IndicatorsDev/equiv. 
      var newId = IMonIndicators.findOne({ adminName: currId }).id;
      Template.currentData().set({ indicator: IMonIndicatorsD.findOne({ id: newId })});
    }

    var graph = template.find('#chart');

    var points = [];

    var data = IMonData.find({ 
      countryCode: Template.currentData().country, 
      indAdminName: Template.currentData().indicatorName }, { sort: { date: 1 } }).forEach(function(d){
        var temp = {
          x: d.date.getTime(),
          y: parseInt(d.value)
        };
        points.push(temp);
      });

    if(points.length>0 && (points.length<2 || allEqual(_.pluck(points, 'x')))){ // has data but not enough for a trend line
      showDate(points[0].x, graph);
      return;
    }
    else if(points.length === 0){ // does not have data at all
      $(template.findAll('.one-data')).remove();
      $(template.find('svg')).hide();
      return;
    }
    else{
      $(template.findAll('.one-data')).remove();
      $(template.find('svg')).show();
    }

    pnts = [ { label: Template.currentData().indicatorName, values: points } ];

    if (template.graph) {
      template.graph.update(pnts);
    } else {
      template.graph = $(graph).epoch({
        type: 'line',
        data: pnts,
        axes: [],
        margins: { left: 0, right: 0, top: 3, bottom: 3 },
      });
    }
    $(template.find('.line')).css('stroke', Template.currentData().color);
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
