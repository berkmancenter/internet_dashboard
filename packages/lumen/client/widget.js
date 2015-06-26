var binLabel = function(startDate) {
  return moment(startDate).fromNow();
  //Settings.numBins - Math.round((Date.now() - startDate) / Settings.binWidth.asMilliseconds()) - 1;
};

Template.LumenWidget.helpers({
  binWidth: function() { return Settings.binWidth.humanize().replace(/^a /, ''); }
});

Template.LumenWidget.onCreated(function() {
  this.subscribe('lumen_counts');
});

Template.LumenWidget.onRendered(function() {
  var template = this;
  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    template.$('.url-counts').empty();

    var urlCounts = LumenCounts.find({}, { sort: { start: 1 } }).map(
      function(bin) { return { x: bin.start, y: bin.urlCount }; }
    );

    var binStarts = _.map(urlCounts, function(d) { return d.x; });
    var tickValues = function(binStarts, numTicks) {
      var total = binStarts.length;
      var step = Math.ceil(total / numTicks) || 0;
      var ticks = [];
      var i;
      for (i = 0; i < total; i += step) {
        ticks.push(binStarts[i]);
      }
      return ticks;
    };

    var margin = {top: 5, right: 20, bottom: 40, left: 40},
        width = 300 - margin.left - margin.right,
        height = 90 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.2);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickValues(tickValues(binStarts, 3))
        .tickFormat(function(d) { return moment(d).fromNow(); })
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(3);

    var svg = d3.select(template.find('.url-counts')).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(binStarts);
    y.domain([0, d3.max(urlCounts, function(d) { return d.y; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(urlCounts)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });
  });
});

