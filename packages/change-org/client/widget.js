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
      .style('stroke', 'white')
      .style('transform', 'scaleY(' + Settings.map.squash + ')')
          .attr("d", d3.geo.path().projection(projection));

    feature.append("svg:title")
      .text(function(d) { return d.properties.name; });

    svg.append('svg:g').attr('id', 'spots');
  });

  var jitter = d3.scale.linear().range([
    -1 * Settings.map.spots.jitter, Settings.map.spots.jitter]);
  var pendingCount = 0;
  var spots = Settings.map.spots;

  ChangePetitions.find().observe({
    added: function(petition) {
      if (pendingCount > Settings.map.spots.pendingMax) {
        return;
      }

      var delay = pendingCount * Settings.map.spots.delay * 1000;
      var jittered = Math.max(0, delay + jitter(Math.random()));
      pendingCount += 1;

      Meteor.setTimeout(function() {
        petition.spot = projection([petition.latLong.long, petition.latLong.lat]);
        svg.select('#spots').append('svg:circle')
          .datum(petition)
          .attr('cx', function(p) { return p.spot[0]; })
          .attr('cy', function(p) { return p.spot[1] * Settings.map.squash; })
          .attr('r', spots.startSize)
          .attr('opacity', spots.startOpacity)
          .attr('fill', spots.startColor)
        .transition()
          .attr('r', spots.stableSize)
          .attr('opacity', spots.stableOpacity)
          .attr('fill', spots.stableColor)
        .transition()
          .delay(Settings.map.spots.ttl * 1000)
          .remove();
        pendingCount -= 1;
      }, jittered);
    }
  });
});
