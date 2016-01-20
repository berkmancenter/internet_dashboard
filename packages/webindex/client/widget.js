Template.WebIndexWidget.helpers({
  updatedAt: function() { return WebIndexData.findOne().updatedAt; }
});

Template.WebIndexWidget.onCreated(function() {
  this.subscribe('webindex_data');
});

Template.WebIndexWidget.onRendered(function() {
  var template = this;
  
  this.autorun(function() {

    var metric;

    if (!template.subscriptionsReady()) {
      return;
    }
    
    metric   = Template.currentData().metric ? Template.currentData().metric : metric = {name: 'Web Index', id: 'INDEX'};

    console.log('metric: ', metric);
    
    d3.select(template.find('.metric_name')).text(metric.name);
    
    template.$('.webindex-data').html('');

    var fillColor = d3.scale.quantize()
        .domain([0, 100])
        .range(['rgb(215,25,28)','rgb(253,174,97)','rgb(255,255,191)','rgb(171,217,233)','rgb(44,123,182)'].reverse());

    var svg = d3.select(template.find('.webindex')).append("svg:svg")
      .attr("width", Settings.map.width)
      .attr("height", Settings.map.height);

    var projection = d3.geo.winkel3()
      .scale(Settings.map.scale)
      .translate([
        Settings.map.width / 2 - Settings.map.bumpLeft,
        Settings.map.height / 2 + Settings.map.bumpDown
      ])
      ;

    var legend = d3.legend.color()
      .scale(fillColor)
      .labelOffset(5)
      .cells(5)
      .labels(['1 to 20', '21 to 40', '41 to 60', '61 to 80', ' > 80+']);

    svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(0, 165)");

    CountryInfo.shapes(function(shapes) {
    var feature = svg.selectAll("path")
        .data(shapes.features)
        .enter().append("svg:path")
        .attr('class', 'country')
	.style('fill', function(d) {
          var country = WebIndexData.findOne({ countryCode: d.id, metricId: metric.id });
          // We have country data. Make it pretty.
          if (country) {
            return fillColor(country.score);
          } else {
            // No data for this country. Make it gray or something.
            return 'rgb(186,186,186)';
          }
        })
      .style('transform', 'scaleY(' + Settings.map.squash + ')')
      .attr("d", d3.geo.path().projection(projection));

      feature.append("svg:title")
        .text(function(d) {
          var title = d.properties.name;
          var country = WebIndexData.findOne({ countryCode: d.id, metricId: metric.id });
          if (country) {
            title += ': Rank ' + country.score + '';
          }
          return title + ' (No data)';
        });

      svg.select(".legend")
        .call(legend);

    });
  });
});
