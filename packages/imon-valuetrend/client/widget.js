Template.IMonValuetrendWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_dev', Template.currentData().country, [ Template.currentData().indicatorName ]);
    template.subscribe('imon_countries_dev');
    template.subscribe('imon_indicators'); // for provider data
    template.subscribe('imon_indicators_dev');
  });
});

Template.IMonValuetrendWidget.helpers({
  countryName: function() { return IMonCountriesDev.findOne({ code: Template.currentData().country }).name; },
  indicator: function() { return IMonIndicatorsDev.findOne({ adminName: Template.currentData().indicatorName }).shortName; },
  currentValue: function() {
    var max = new Date("1000");
    var val = 0;
    var found = false;
    IMonDev.find({ 
      countryCode: Template.currentData().country,
      indAdminName: Template.currentData().indicatorName 
    }).forEach(function(d){
      found = true;
      if(d.date.getTime() > max.getTime()){
        max = d.date;
        val = d.value;
      }
    });
    val = val >= 1000000 ? (Math.round(val/1000000*100)/100).toLocaleString() + 'M' : (Math.round(val * 100) / 100).toLocaleString();
    var dispClass = IMonIndicatorsDev.findOne({ adminName: Template.currentData().indicatorName }).displayClass;
    val = (dispClass && dispClass in Settings.suffix) ? val + '<span class="display-suffix">' + Settings.suffix[dispClass]  + '</span>' : val;
    return found ? val : '<p class="no-data"> No data found.</p>';
  },
  trendLabel: function() {
    var min = new Date("9999");
    var max = new Date("1000");
    var i = 0;
    IMonDev.find({
      countryCode: Template.currentData().country,
      indAdminName: Template.currentData().indicatorName
    }).forEach(function(d){
      i++;
      if(d.date.getTime() > max.getTime()) max = d.date;
      if(d.date.getTime() < min.getTime()) min = d.date;
    });
    var minYear = min.getFullYear();
    var maxYear = max.getFullYear();
    if(minYear === maxYear){
      return i>1 && !allEqual([min.getTime(),max.getTime()]) ? 'From ' + Settings.months[min.getMonth()] + ' to ' + Settings.months[max.getMonth()] + ' ' + minYear : '';
    }
    else{
      return i>1 && !allEqual([min.getTime(),max.getTime()]) ? 'From ' + minYear + ' to ' + maxYear : '';
    }
  }
});

Template.IMonValuetrendWidget.onRendered(function() {
  var template = this;
  
  var showDate = function(ms, graph){
    var toDate = new Date(ms);
    var toYear = toDate.getFullYear();
    $(graph).html('<p class="no-data one-data" title="No trend data available.">From ' + toYear + '</p>');
  }

  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }
    var cachedIndicator = Template.currentData().indicator;
    var currId = Template.currentData().indicatorName;
    if(!cachedIndicator || IMonIndicatorsDev.findOne({ id: cachedIndicator.id }).adminName !== currId){
      // done this way until provider/source data is in IndicatorsDev/equiv. 
      var newId = IMonIndicatorsDev.findOne({ adminName: currId }).id;
      Template.currentData().set({ indicator: IMonIndicators.findOne({ id: newId })});
    }

    var graph = template.find('#chart');

    var points = [];
    var data = IMonDev.find({ 
      countryCode: Template.currentData().country, 
      indAdminName: Template.currentData().indicatorName }, { sort: { date: 1 } }).forEach(function(d){
        var temp = {
          x: d.date.getTime(),
          y: parseInt(d.value)
        };
        points.push(temp);
      });
    if (points.length<2 || allEqual(_.pluck(points, 'x'))) {
      if(points.length>0)
        showDate(points[0].x, graph);
      return;
    } else {
      $(template.findAll('.no-data')).remove();
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
    if(results[i] != x){
      equal = false;
      break;
    }
  }
  return equal;
}
