Template.AkamaiAttacksWidget.helpers({
  updatedAt: function() { return CountryAttacks.findOne().updatedAt; }
});

Template.AkamaiAttacksWidget.onCreated(function() {
  this.subscribe('country_attacks');
});

Template.AkamaiAttacksWidget.onRendered(function() {
  var template = this;

  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    template.$('.akamai-attacks').html('');

    var fillColor = d3.scale.quantize()
      .domain([0, 10])
      .range([
        'rgb(254,229,217)',
        'rgb(252,174,145)',
        'rgb(251,106,74)',
        'rgb(222,45,38)',
        'rgb(165,15,21)'
      ]);

    var svg = d3.select(template.find('.world-map')).append("svg:svg")
      .attr("width", Settings.mapWidth)
      .attr("height", Settings.mapHeight);

    var projection = d3.geo.winkel3()
      .scale(Settings.mapScale)
      .translate([
        Settings.mapWidth / 2 - Settings.mapBumpLeft,
        Settings.mapHeight / 2 + Settings.mapBumpDown
      ]);

    var legend = d3.legend.color()
      .scale(fillColor)
      .labelOffset(5)
      .cells(5)
      .labels(['0 to 2%', '2 to 4%', '4 to 6%', '6 to 8%', ' > 8%']);

    CountryInfo.shapes(function(shapes) {
      var feature = svg.selectAll("path")
        .data(shapes.features)
        .enter().append("svg:path")
        .attr('class', 'country')
        .style('fill', function(d) {
          var country = CountryAttacks.findOne({ countryCode: d.id });
          var fillValue = 0;
          if (country) {
            fillValue = country.percentAboveAverage;
          }
          return fillColor(fillValue);
        })
        .style('transform', 'scaleY(' + Settings.mapSquash + ')')
        .attr("d", d3.geo.path().projection(projection));

      feature.append("svg:title")
        .text(function(d) {
          var title = d.properties.name;
          var country = CountryAttacks.findOne({ countryCode: d.id });
          if (country) {
            title += ': ' + d3.format('.1f')(country.percentAboveAverage) + '%';
          }
          return title;
        });

      svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(0, 165)");

      svg.select(".legend")
        .call(legend);
    });
  });
});
