Template.IMonValuetrendWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_dev');
    template.subscribe('imon_countries_dev');
    template.subscribe('imon_indicators');
  });
});

Template.IMonValuetrendWidget.helpers({
  countryName: function() { return IMonCountriesDev.findOne({ code: Template.currentData().country }).name; },
  indicator: function() { return IMonIndicators.findOne({ adminName: Template.currentData().indicatorName }).shortName; },
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
    var suffix = IMonIndicators.findOne({ adminName: Template.currentData().indicatorName }).displaySuffix;
    val = suffix ? val + '<span class="display-suffix">' + suffix  + '</span>' : val;
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
  var hideGraph = function($graph) {
    $(template.find('svg')).hide();
    if ($(template.find('.no-data')).length === 0) {
      $($graph).append('<p class="no-data">No trend data available.</p>');
    }
  };

  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }
    var cachedIndicator = Template.currentData().indicator;
    var currId = Template.currentData().indicatorName; 
    if(!cachedIndicator || cachedIndicator.adminName !== currId){
      Template.currentData().set({ indicator: IMonIndicators.findOne({ adminName: currId })});
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
      hideGraph(graph);
      return;
    } else {
      $(template.find('.no-data')).remove();
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