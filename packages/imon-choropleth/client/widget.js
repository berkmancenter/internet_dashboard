
var currentIndicator = function(){
  return Template.currentData().indicator ? Template.currentData().indicator : indicator = Template.ImonChoroplethSettings.defaultIndicator;
};

Template.ImonChoroplethWidget.updateSubscription = function(template){
  var indicator = currentIndicator();
  template.subscribe(
    'imon_data',
    'all',
    [ indicator.name ]
  );    
};

Template.ImonChoroplethWidget.onCreated(function() {
  Template.ImonChoroplethWidget.updateSubscription(this);
});

Template.ImonChoroplethWidget.onRendered(function() {
  
  var template = this;

  this.autorun(function() {

    var indicator = currentIndicator();

    // there must be a better way to do this...
    Template.ImonChoroplethWidget.updateSubscription(template);
    
    if (!template.subscriptionsReady()) {
      return;
    }

    d3.select(template.find('.indicator_name')).text(indicator.name);
    
    template.$('.imon-choropleth-data').html('');

    var countryDataByCode = {};
    var query = { };
    var scores=[];
    var scoreSet={};
    query.name = indicator.name; // this shouldn't be necessary with proper subscription.
    IMonData.find(query).forEach(function(countryData){
      countryDataByCode[countryData.countryCode.toUpperCase()]=countryData;
      scores.push(countryData.percent);
      scoreSet[countryData.percent]=1;
    });

    var fillColor;

    // For now, split things into quintiles unless they don't have enough variety in which case split into quartiles or terciles.
    // these things should be indicator specific.
    var quantile     = true;
    var range        = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
    var legendLabels = ['Bottom', '2nd Quintile', '3rd Quintile', '4th Quintile', 'Top'];

    if (Object.keys(scoreSet).length === 4 ) {
      range        = ['#f1eef6','#bdc9e1','#74a9cf','#0570b0'];
      legendLabels = ['Bottom', '2nd Quartile', '3rd Quartile', 'Top'];
    } else if ( Object.keys(scoreSet).length === 3 ) {
      range        = ['#ece7f2','#a6bddb','#2b8cbe'];
      legendLabels = ['Bottom', 'Middle', 'Top'];
    }
    
    if ( quantile) {
        fillColor = d3.scale.quantile()
        .domain(scores)
        .range(range);
    } else {
        //fillColor = d3.scale.quantize()
        //.domain(domain)
        //.range(range);
    }

    var svg = d3.select(template.find('.imon-choropleth')).append("svg:svg")
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
        .labels(legendLabels);

    svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(0, 165)");

    CountryInfo.shapes(function(shapes) {
      var feature = svg.selectAll("path")
          .data(shapes.features)
          .enter().append("svg:path")
          .attr('class', 'country')
	  .style('fill', function(d) {
            var country = countryDataByCode[d.id];
            // We have country data. Make it pretty.
            if (country) {
              return fillColor(country.percent);
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
          var country = countryDataByCode[d.id];
          if (country) {
            return title += ': ' + indicator.name +  ': ' + country.value + '';
          }
          return title + ' (No data)';
        });

      svg.select(".legend")
        .call(legend);
      
    });
  });
});
