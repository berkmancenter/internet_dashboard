Template.GoogleTrendsMapWidget.onCreated(function() {
  var template = this;
  template.autorun(function(){
    template.subscribe('imon_countries_v2');
    if(!Template.currentData().keyword) {
      Template.currentData().keyword  = 'node.js';
    }
    console.log('subscribing to google_trends with keyword: ' + Template.currentData().keyword);
    console.log('REINOS: ' , template);
    console.log('REINOS: ' , this);
    template.subscribe('google_trends', Template.currentData().keyword, Template.currentData().widget._id);
  });
});
//etetre
var newIndicator = { min:0, max:100};


Template.GoogleTrendsMapWidget.onRendered(function() {

  var template = this;

  template.autorun(function() {
    if (!template.subscriptionsReady()) {  return;  }
    // Make sure indicator is in the right format

    console.log('Subscriptions are ready!');
    d3.select(template.find('.keyword')).text(Template.currentData().keyword);

    template.$('.google-trends-map-data').html('');

    console.log(GoogleTrends.find({}).count());

    var countryDataByCode = {};
    var scores=[];
    var scoreSet={};
    var countries = IMonCountries.find().fetch(); // get list of all countries
    for(var i=0; i<countries.length; i++){
      var currCode = countries[i].code;
      //console.log(`Looking for country code: ${currCode}`)
      GoogleTrends.find({ countryCode: currCode }).forEach(function(d){
        console.log('We got a hit!' + d.score);
        countryDataByCode[currCode.toUpperCase()] = d;
        if(d.score !== undefined){
          scores.push(d.score);
        }
        if(_.has(scoreSet, d.score)){
          scoreSet[d.score]+=1;
        }
        else{
          scoreSet[d.score]=1;
        }
      });
    }


    var formatLegendLabelNumber = function formatLegendLabelNumber (number,precision){
      precision = precision ? precision : 1;
      if ( number > 1000000 ) {
        return (number / 1000000).toFixed(precision) + "M";
      } else if ( number > 1000 ) {
        return (number / 1000).toFixed(precision) + "K";
      } else {
        if ( newIndicator.displayClass && newIndicator.displayClass in Settings.suffix){
          return number.toFixed(1) + Settings.suffix[newIndicator.displayClass];
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
          var max = newIndicator.max;
          // crude, temporary attempt to bring out resolution with lumpy data.
          if (max > 100 && newIndicator.min < 10) {
            max = 80;
          }
          colorScale = d3.scale.quantize().domain([newIndicator.min,max]).range(range);
          var buckets = _.map(range,function(color,i){ return newIndicator.min + ((i+1)*((max-newIndicator.min)/5)); });
          legendLabels[0]= "< " + formatLegendLabelNumber(buckets[0],precision);
          _.each(buckets, function(bucket,i){
            legendLabels[i+1] = ">="+formatLegendLabelNumber(bucket,precision);
          });
        }
      }
    };

    var precision =_.max(uniqueScores)>1 ? 1 : 2;

    setLegendLabels(precision);

    var svg = d3.select(template.find('.google-trends-map')).append("svg:svg")
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
              return colorScale(country.score);
            } else {
              // No data for this country. Make it gray or something.
              return 'rgb(186,186,186)';
            }
          })
          .style('transform', 'scaleY(' + Settings.map.squash + ')')
          .attr("d", d3.geo.path().projection(projection));

      feature.append("svg:title")
        .text(function(d) {
          var title = d.properties.name + ' : ' + d.properties.countryCode;
          var country = countryDataByCode[d.id];
          if (country) {
            return title + ': ' + formatLegendLabelNumber(Number(country.score),precision) + '';
          }
          return title + ' (No data)';
        });

      svg.select(".legend")
        .call(legend);

    });
  });
});
