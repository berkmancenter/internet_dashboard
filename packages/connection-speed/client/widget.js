Template.ConnectionSpeedWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_data_v2', Template.currentData().country.code, Settings.indicatorId, true);
    template.subscribe('imon_indicators_v2');
  });
});

Template.ConnectionSpeedWidget.onRendered(function() {
  var template = this;

  var width = Settings.gaugeWidth,
      height = width / 2,
      radius = height;

  var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius - 40);

  var pie = d3.layout.pie()
      .sort(null)
      .startAngle(Math.PI / -2)
      .endAngle(Math.PI / 2);

  var color = d3.hsl('#428bca');
  var colors = [color, '#f1f1f1'];//d3.hsl(color.h, color.s * 0.4, color.l * 1.75)];

  var svg = d3.select(this.find('.gauge')).append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height + ")");

  svg.append('text')
    .attr("class", "speed")
    .attr('transform', 'translate(0,' + (height / -4) + ')')
    .style('text-anchor', 'middle')
    .style('font-size', '22px');

  this.autorun(function() {
    if (!template.subscriptionsReady()) { return; }
    var max = IMonIndicators.findOne({ adminName: Settings.indicatorId }).max;
    var indicator;
    IMonData.find({
        countryCode: Template.currentData().country.code,
        indAdminName: Settings.indicatorId
    }).forEach(function(d){
      indicator = d;
    });
    var speedPercent = 0.001;
    if (indicator && getPercent(indicator.value, max) > 0) {
      speedPercent = getPercent(indicator.value, max) * 100;
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

function getPercent(value, max){
  return value/max;
}