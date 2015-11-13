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

    svg.append('svg:g').attr('id', 'spots');
  });


  ChangePetitions.find().observe({
    added: function(petition) {
      petition.spot = projection([petition.latLong.long, petition.latLong.lat]);
      svg.select('#spots').append('svg:circle')
        .datum(petition)
        .attr('cx', function(p) { return p.spot[0]; })
        .attr('cy', function(p) { return p.spot[1] * Settings.map.squash; })
        .attr('r', Settings.map.spots.size)
        .attr('opacity', 1)
        .attr('fill', Settings.map.spots.color)
      .transition()
        .duration(Settings.map.spots.fadeTime * 1000)
        .attr('r', 0)
        //.attr('opacity', 0)
        .remove();
    }
  });
});
