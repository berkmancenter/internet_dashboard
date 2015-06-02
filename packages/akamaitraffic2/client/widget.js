Template.AkamaiTraffic2Widget.helpers({
  updatedAt: function() { return CountryTraffic.findOne().updatedAt; }
});

Template.AkamaiTraffic2Widget.onCreated(function() {
  this.subscribe('country_traffic');
});

Template.AkamaiTraffic2Widget.onRendered(function() {
  var template = this;

  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    template.$('.bytes-delivered').html('');

    var fillColor = d3.scale.quantize()
      .domain([0, 10])
      /*
      .range(['rgb(237,248,233)','rgb(186,228,179)','rgb(116,196,118)','rgb(49,163,84)','rgb(0,109,44)']);
      /*/
      .range([
        'rgb(241,238,246)',
        'rgb(189,201,225)',
        'rgb(116,169,207)',
        'rgb(43,140,190)',
        'rgb(4,90,141)'
      ]);
      //*/

    var svg = d3.select(template.find('.world-map')).append("svg:svg")
      .attr("width", Settings.map.width)
      .attr("height", Settings.map.height);

    var projection = d3.geo.winkel3()
      .scale(Settings.map.scale)
      .translate([
        Settings.map.width / 2 - Settings.map.bumpLeft,
        Settings.map.height / 2 + Settings.map.bumpDown
      ]);

    var feature = svg.selectAll("path")
      .data(WorldCountries.features)
      .enter().append("svg:path")
      .attr('class', 'country')
      .style('fill', function(d) {
        var country = CountryTraffic.findOne({ regionLabel: d.properties.name });
        var fillValue = 0;
        if (country) {
          fillValue = country.percentAboveAverage;
        }
        return fillColor(fillValue);
      })
      .style('transform', 'scaleY(' + Settings.map.squash + ')')
      .attr("d", d3.geo.path().projection(projection));

    feature.append("svg:title")
      .text(function(d) { return d.properties.name; });
  });
});
