Template.IMonSpeedometerWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_indicators');
    template.subscribe('imon_indicators_v2');
    template.subscribe('imon_countries_v2');
    if(Template.currentData().indicatorName){
      template.subscribe('imon_data_v2', Template.currentData().country, Template.currentData().indicatorName, !Template.currentData().byYear);
    }
  });
});

Template.IMonSpeedometerWidget.onRendered(function() {
  var template = this;

  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }

    if(Template.currentData().indicatorId && !Template.currentData().indicatorName){
      var adName = IMonMethods.idToAdminName(Template.currentData().indicatorId);
      var newData = {
        indicatorName: adName
      };
      Template.currentData().set(newData);
    }

    $(template.find('.gauge')).empty();

    var widgetNode = template.firstNode.parentNode.parentNode;
    var widgetHeight = parseInt($(widgetNode).attr('data-sizey'));
    var widgetWidth = parseInt($(widgetNode).attr('data-sizex'));

    var width = Settings.gaugeWidth * widgetWidth,
        height = widgetWidth >= widgetHeight ? width / (2 * widgetWidth / widgetHeight) : width / 2,
        radius = height;

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - 40);

    var pie = d3.layout.pie()
        .sort(null)
        .startAngle(Math.PI / -2)
        .endAngle(Math.PI / 2);

    var color = d3.hsl(Template.currentData().color);
    var colors = [color, '#e7e7e7'];

    var svg = d3.select(template.find('.gauge')).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height + ")");

    svg.append('text')
      .attr("class", "speed")
      .attr('transform', 'translate(0,' + (height / -4) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', '22px');

    // 1. Set data source/indicator
    var cachedIndicator = Template.currentData().indicator;
    var currName = Template.currentData().indicatorName;
    var currInd = IMonIndicators.findOne({ adminName: Template.currentData().indicatorName });
    var currId = currInd.id; 
    if(!cachedIndicator || cachedIndicator.id !== currId){
      Template.currentData().set({ indicator: IMonIndicatorsD.findOne({ id: currId })});
    }

    // Fill title
    var titlePlace = template.find('.title');
    var indicatorName = IMonIndicators.findOne({ adminName: Template.currentData().indicatorName }).name.replace(/( \(kbps\))/ig, '');
    var countryName = IMonCountries.findOne({ code: Template.currentData().country }).name;
    $('h1', titlePlace).text(indicatorName);
    $('h2', titlePlace).text(countryName);

    var IMon = Template.currentData().byYear ? IMonData : IMonRecent;
    var selector = { countryCode: Template.currentData().country, indAdminName: Template.currentData().indicatorName };
    if(Template.currentData().byYear){ selector.$where = function(){ return this.date.getFullYear() === Template.currentData().chosenYear; }; }
    var indicator = IMon.findOne(selector, { $sort: { date: -1 } });
    var speedPercent = 0.001;
    if (indicator && getPercent(indicator.value, currInd.max) > 0) {
      speedPercent = getPercent(indicator.value, currInd.max) * 100;
      var text = indicator.value.toLocaleString() + ' kbps';
      svg.select('.speed').text(text);
    } else {
      svg.select('.speed').text('No data');
    }
    if (speedPercent === 100) {
      speedPercent -= 0.001;
    }

    var data = [speedPercent, 100 - speedPercent];
    var updateSel = svg.selectAll(".arc").data(pie(data));

    updateSel.enter().append("g")
        .attr("class", "arc")
      .append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return colors[i]; });

    updateSel.select('path').transition().attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		});

    updateSel.exit().remove();
  });
});

function getPercent(value, max){ // only max since speed can't be -ve
  return value/max;
}