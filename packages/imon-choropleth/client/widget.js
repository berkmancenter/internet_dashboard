
Template.IMonChoroplethWidget.updateSubscription = function(template){
  // Make sure we're always subscribed to the currently selected indicator.
  // Seems unnecessarily complicated.
  if ( ! Template.currentData().newIndicatorId ) {
    Template.currentData().set({newIndicatorId: Template.IMonChoroplethSettings.defaultIndicatorId});
    //return;
  }
  if ( (Template.currentData().newIndicatorId !== Template.currentData().indicatorId)) {
    Template.currentData().set({indicatorId: Template.currentData().newIndicatorId});
    //return;
  }
  template.subscribe(
    'imon_indicators'
  );
  template.subscribe(
    'imon_data',
    'all',
    [ parseInt(Template.currentData().newIndicatorId) ],
    'id'
  );    
};

Template.IMonChoroplethWidget.onCreated(function() {
  Template.IMonChoroplethWidget.updateSubscription(this);
});

Template.IMonChoroplethWidget.onRendered(function() {

  var template = this;

  this.autorun(function() {

    // there must be a better way to do this...
    Template.IMonChoroplethWidget.updateSubscription(template);
    
    if (!template.subscriptionsReady()) {
      return;
    }

    var indicator = IMonIndicators.findOne({id:parseInt(Template.currentData().indicatorId)});
    var cachedIndicator = Template.currentData().indicator;
    if ( !(cachedIndicator) || (cachedIndicator.id !== indicator.id)){
      Template.currentData().set({indicator: indicator});
    }
    
    if ( ! indicator ) {
      console.log('No indicator found for indicatorId: ' + Template.currentData().indicatorId);
      return;
    }
      
    d3.select(template.find('.indicator_name')).text(indicator.shortName);
    
    template.$('.imon-choropleth-data').html('');

    var countryDataByCode = {};
    var query = { };
    var scores=[];
    var scoreSet={};
    query.sourceId = parseInt(indicator.id); // why is this necessary?
    IMonData.find(query).forEach(function(countryData){
      countryDataByCode[countryData.countryCode.toUpperCase()]=countryData;
      if ( countryData.value !== undefined) {
        scores.push(countryData.value);
        if (_.has(scoreSet,countryData.value)){
          scoreSet[countryData.value]+=1;
        } else {
          scoreSet[countryData.value]=1;
        }
      }
    });

    var formatLegendLabelNumber = function formatLegendLabelNumber (number,precision){
      precision = precision ? precision : 1;
      if ( number > 1000000 ) {
        return (number / 1000000).toFixed(precision) + "M";
      } else if ( number > 1000 ) {
        return (number / 1000).toFixed(precision) + "K";
      } else {
        if ( indicator.displaySuffix){
          return number.toFixed(1) + indicator.displaySuffix;
        } else if ( number % 1 === 0 ) {
          return number;
        } else {
          return number.toFixed(precision);
        }
      }
    };

    var range        = ['#ece7f2','#bdd7e7','#6baed6','#3182bd','#08519c'];
    
    var uniqueScores = Object.keys(scoreSet);
    uniqueScores = uniqueScores.sort(function(a, b){ return a-b; });
    
    if (uniqueScores.length === 4 ) {
      range        = ['#ece7f2','#bdc9e1','#74a9cf','#0570b0'];
    } else if ( uniqueScores.length === 3 ) {
      range        = ['#ece7f2','#a6bddb','#2b8cbe'];
    }

    // by default, we use a quantile scale.
    
    var colorScale;
    colorScale = d3.scale.quantile()
      .domain(scores)
      .range(range);

    var useQuantileScale = true;

    // but let's check, are quantile scales appropriate for this data?
    if ( uniqueScores.length < 5 ) {
      useQuantileScale = false;
    } else {
      _.each(colorScale.quantiles(), function(quantile,i){
        if ( i > 0 && colorScale.quantiles()[i-1] === quantile){
          console.log("Duplicate quantiles. Quantiles not working for this data. Use quantize.", colorScale.quantiles());
          useQuantileScale = false;
          return;
        }
      });
    }

    var lengendLabels;
    
    var setLegendLabels = function setLegendLabels(precision){
      legendLabels = [];
      if (useQuantileScale){
        // quantile scale is best, most data-tailored scale when we have sufficient range of values.
        legendLabels[0]= "< " + formatLegendLabelNumber(colorScale.quantiles()[0],precision);
        _.each(colorScale.quantiles(), function(quantile,i){
          legendLabels[i+1] = ">="+formatLegendLabelNumber(quantile,precision);
        });
      } else {
        if ( uniqueScores.length <= 5 ) {
          // use ordinal scale for just a few values.
          colorScale = d3.scale.ordinal().domain(uniqueScores).range(range);
          // sometimes these numbers are strings. why?
          _.each(uniqueScores, function(score,i){
            legendLabels[i] = formatLegendLabelNumber(Number(score),precision);
          });
        } else {
          // use quantize scale to cut into 5 equal groups from min to max
          var max = indicator.max;
          // crude, temporary attempt to bring out resolution with lumpy data.
          if (max > 100 && indicator.min < 10) {
            max = 80;
          }
          colorScale = d3.scale.quantize().domain([indicator.min,max]).range(range);
          var buckets = _.map(range,function(color,i){ return indicator.min + ((i+1)*((max-indicator.min)/5)); });
          legendLabels[0]= "< " + formatLegendLabelNumber(buckets[0],precision);
          _.each(buckets, function(bucket,i){
            legendLabels[i+1] = ">="+formatLegendLabelNumber(bucket,precision);
          });
        }
      }
    };

    var precision =_.max(uniqueScores)>1 ? 1 : 2;
    
    setLegendLabels(precision);
      
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
      .scale(colorScale)
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
              return colorScale(country.value);
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
            return title + ': ' + formatLegendLabelNumber(Number(country.value),precision) + '';
          }
          return title + ' (No data)';
        });

      svg.select(".legend")
        .call(legend);
      
    });
  });
});
