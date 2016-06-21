Template.IMonSpeedometerWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    var indicators = [ Template.currentData().indicatorId ];
    template.subscribe('imon_data', 'all', indicators, 'id');
    template.subscribe('imon_indicators');
    template.subscribe('imon_countries');
  });
});

Template.IMonSpeedometerWidget.onRendered(function() {
  var template = this;

  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }

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
    var currId = Template.currentData().indicatorId; 
    if(!cachedIndicator || cachedIndicator.id !== currId){
      Template.currentData().set({ indicator: IMonIndicators.findOne({ id: currId })});
    }

    // Fill title
    var titlePlace = template.find('.title');
    var indicatorName = IMonIndicators.findOne({ id: Template.currentData().indicatorId }).name.replace(/( \(kbps\))/ig, '');
    var countryName = IMonCountries.findOne({ code: Template.currentData().country }).name;
    $('h1', titlePlace).text(indicatorName);
    $('h2', titlePlace).text(countryName);

    var indicator = IMonData.findOne({ 
      countryCode: Template.currentData().country,
      sourceId: Template.currentData().indicatorId
    });
    var speedPercent = 0.001;
    if (indicator && indicator.percent > 0) {
      speedPercent = indicator.percent * 100;
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
