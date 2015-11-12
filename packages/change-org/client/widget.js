Template.ChangeOrgWidget.onCreated(function() {
  this.subscribe('change_petitions');
});

Template.ChangeOrgWidget.onRendered(function() {
  var template = this;

  var svg = d3.select(template.find('.world-map')).append("svg:svg")
    .attr("width", Settings.map.width)
    .attr("height", Settings.map.height);

  var projection = d3.geo.winkel3()
    .scale(Settings.map.scale)
    .translate([
        Settings.map.width / 2 - Settings.map.bumpLeft,
        Settings.map.height / 2 + Settings.map.bumpDown
    ]);

  CountryInfo.shapes(function(shapes) {
    var feature = svg.selectAll("path")
      .data(shapes.features)
      .enter().append("svg:path")
      .attr('class', 'country')
      .style('fill', Settings.map.fill)
      .style('transform', 'scaleY(' + Settings.map.squash + ')')
          .attr("d", d3.geo.path().projection(projection));

    feature.append("svg:title")
      .text(function(d) { return d.properties.name; });
  });

  var spots = svg.append('svg:g').attr('id', 'spots');

  this.autorun(function() {
    if (!template.subscriptionsReady()) { return; }
    ChangePetitions.find().observe({
      added: function(petition) {
        var spot = projection([petition.latLong.long, petition.latLong.lat]);
        var data = spots.data([spot]);
        data.enter().append('svg:circle')
          .attr('cx', spot[0])
          .attr('cy', spot[1])
          .attr('r', Settings.spots.size)
          .attr('fill', Settings.spots.color);

        data.exit().transition()
          .attr('opacity', 0)
          .attr('r', 0)
          .duration(Settings.spots.fadeTime * 1000);
      }
    });
  });
});
