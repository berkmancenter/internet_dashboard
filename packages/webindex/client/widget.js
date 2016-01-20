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
    
    metric   = Template.currentData().metric; //'FH_B';
    
    console.log('REINOS: autorrun is running! ' + metric);

    d3.select(template.find('.metric_name')).text(metric.name);
    
    template.$('.webindex-data').html('');

    var fillColor = d3.scale.quantize()
      .domain([0, 100])
      /*
      .range(['rgb(237,248,233)','rgb(186,228,179)','rgb(116,196,118)','rgb(49,163,84)','rgb(0,109,44)']);
      /*/
        .range(
          ['rgb(215,25,28)','rgb(253,174,97)','rgb(255,255,191)','rgb(166,217,106)','rgb(26,150,65)'].reverse()
        );
      //*/

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
	  // REINOS: all we have to do is have it filter on metric type here as well.
          var country = WebIndexData.findOne({ countryCode: d.id, metricId: metric.id });

          // We have country data. Make it pretty.
          if (country) {
            if (country.countryCode === 'USA'){
              console.log('country:' , country);
            }
            return fillColor(country.score);
          }
          // No data for this country. Make it gray or something.
          return 'rgb(186,186,186)';
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
          return title;
        });

      svg.select(".legend")
        .call(legend);

    });
  });
});
