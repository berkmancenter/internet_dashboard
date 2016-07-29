Template.IMonChoroplethWidget.onCreated(function() {
  var template = this;
  template.autorun(function(){
    template.subscribe('imon_indicators');
    template.subscribe('imon_indicators_v2');
    template.subscribe('imon_countries_v2');
    // Even though data is arranged and sent as an array from the server, this is needed because IMonRecent updates with new subs as opposed to seeding
    // so to make sure the latest data is fetched/used for these indicators, we must sub.
    if(!Template.currentData().animate) template.subscribe('imon_data_v2', 'all', Template.currentData().indicatorName, true);
  });
});

Template.IMonChoroplethWidget.helpers({
  year: function(){ 
    var id = Template.instance().data.widget._id;
    return Template.currentData().animate && Session.get(id+'-array') ? Session.get(id+'-array')[Session.get(id+'-current')] : '';
  }
});

Template.IMonChoroplethWidget.onRendered(function() {
  var template = this;
  var id = Template.instance().data.widget._id;

  template.autorun(function() {
    template.$('.imon-choropleth-data').hide();
    template.$('.animation-button').hide();
    template.$('.animation-button').off();
    if (!template.subscriptionsReady()) {  return;  }
    var svg;
    var height = Template.currentData().animate ? Settings.map.height - 50 : Settings.map.height;
    // Make sure indicator is in the right format
    if(Template.currentData().indicatorId && !Template.currentData().indicatorName){ // because old structure used indicatorId
        var adName = IMonMethods.idToAdminName(Template.currentData().indicatorId);
        var newData = {
          indicatorName: adName
        };
        Template.currentData().set(newData);
    }
    var newIndicator = IMonIndicators.findOne({adminName:Template.currentData().indicatorName});
    var indicator = IMonIndicatorsD.findOne({ id: newIndicator.id });
    var cachedIndicator = Template.currentData().indicator;
    if ( !(cachedIndicator) || (cachedIndicator.id !== indicator.id)){
      Template.currentData().set({indicator: indicator});
    }
    
    if ( ! newIndicator ) {
      console.log('No indicator found for indicator admin name: ' + Template.currentData().indicatorName);
      return;
    }
      
    d3.select(template.find('.indicator_name')).text(newIndicator.shortName);
    
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

    var currData = Template.currentData();

    Meteor.call('getChoroplethData', currData.indicatorName, !currData.animate, function(error, result){
      var draw = function(isRecent, year, currentData, isFirst){
      // 1. Common
          var countryDataByCode = {};
          var scores=[];
          var scoreSet={};
          var countries = isRecent ? result : result[index(result, year)].records; // get list of all countries
          for(var i=0; i<countries.length; i++){
            var d = countries[i];
            var currCode = d.country;
            countryDataByCode[currCode.toUpperCase()] = d;
            scores.push(d.value);
            scoreSet[d.value] = _.has(scoreSet, d.value) ? scoreSet[d.value] + 1 : 1;
          }
          if(scores.length===0 && !isRecent) { return; }
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
        }

        var precision =_.max(uniqueScores)>1 ? 1 : 2;
        
        setLegendLabels(precision);

           var projection = d3.geo.winkel3()
          .scale(Settings.map.scale)
          .translate([
            Settings.map.width / 2 - Settings.map.bumpLeft,
            height / 2 + Settings.map.bumpDown
          ])
          ;

        var legend = d3.legend.color()
          .scale(colorScale)
          .labelOffset(5)
          .cells(5)
            .labels(legendLabels);


        // 2. Init function
        var init = function(){
          template.$('.imon-choropleth-data').empty();
          template.$('.imon-choropleth-data').show();
          svg = d3.select(template.find('.imon-choropleth')).append("svg:svg")
            .attr("width", Settings.map.width)
            .attr("height", height);


          svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(0, 100)");

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
            feature.append("title")
            .text(function(d) {
                var title = d.properties.name;
                var country = countryDataByCode[d.id];
                if (country) {
                  return title + ': ' + formatLegendLabelNumber(Number(country.value),precision) + '';
                }
                return title + ' (No data)';
              });         
          });
      };

      var update = function(){
        var countryShapes = svg.selectAll('.country');
        countryShapes.style('fill', function(d) {
                  var country = countryDataByCode[d.id];
                  // We have country data. Make it pretty.
                  if (country) {
                    return colorScale(country.value);
                  } else {
                    // No data for this country. Make it gray or something.
                    return 'rgb(186,186,186)';
                  }
                }).select("title")
              .text(function(d) {
                var title = d.properties.name;
                var country = countryDataByCode[d.id];
                if (country) {
                  return title + ': ' + formatLegendLabelNumber(Number(country.value),precision) + '';
                }
                return title + ' (No data)';
        });
      };
      if(isRecent || isFirst){ init(); }
      else{ update(); }
      svg.select(".legend")
        .call(legend);
    };
    if(currData.animate){
      var buttonPlace = template.find('.choropleth-button');
      var arr = getYears(result);
      Session.set(id+'-array', arr);
      Session.set(id+'-current', 0);
      var play = function(i, currentData, iterate){
        if(i!==0) toggle('#step-backward-button', buttonPlace, false);
        else toggle('#step-backward-button', buttonPlace, true); 

        if(i===arr.length-1) toggle('#step-forward-button', buttonPlace, true); 
        else toggle('#step-forward-button', buttonPlace, false);

        draw(false, arr[i], currentData, !iterate);
        Session.set(id+'-current', i);
        i++;
        if(i!==arr.length && iterate){
          var playing = Meteor.setTimeout(function(){ play(i, currentData, true); }, 1000);
          $('#pause-button', buttonPlace).one('click', function(){
            Meteor.clearTimeout(playing);
            $(this).hide();
            $('#play-button', buttonPlace).show();
          });
        }
        else if(i===arr.length){
          $('#pause-button', buttonPlace).hide(); 
          $('#play-button', buttonPlace).show(); 
          toggle('#step-forward-button', buttonPlace, true); 
        }
      };

      var moveCurrent = function(isForward, currentData){
      // 1. Get common years and current position;
      var current = Session.get(id+'-current');

      // 2. Calculate difference and new value 
      var diff = isForward ? 1 : -1;
      var newVal = current + diff;

      // 3. Handle errors
      if(newVal >= arr.length || newVal<0){ return; }

      // 4. Move
      var chosen = arr[newVal];
      Session.set(id+'-current', newVal);
      draw(false, chosen, currentData, false);

      // 5. Toggle controllers
      if(isForward){
        toggle('#step-backward-button', buttonPlace, false); 
        if(newVal===arr.length-1){
          toggle('#step-forward-button', buttonPlace, true); 
        } 
      }
      else{
        toggle('#step-forward-button', buttonPlace, false); 
        if(newVal===0){
          toggle('#step-backward-button', buttonPlace, true); 
        } 
      }
    };

      $('#play-button', buttonPlace).show();
      $('#step-forward-button', buttonPlace).show();
      $('#step-backward-button', buttonPlace).show();
      if(arr.length>1){
        toggle('#play-button', buttonPlace, false);
        toggle('#step-backward-button', buttonPlace, false);
        toggle('#step-forward-button', buttonPlace, false);
        $('#play-button', buttonPlace).click(function(){
          $(this).hide();
          $('#pause-button', buttonPlace).show();
          var p = Session.get(id+'-current') === arr.length - 1 ? 0 :  Session.get(id+'-current');
          play(p, currData, true);
        });
        $('#step-backward-button', buttonPlace).click(function(){
          moveCurrent(false, currData);
        });
        $('#step-forward-button', buttonPlace).click(function(){
          moveCurrent(true, currData);
        });
      }
      else{
        toggle('#play-button', buttonPlace, true);
        toggle('#step-backward-button', buttonPlace, true);
        toggle('#step-forward-button', buttonPlace, true);
      }
      play(0, currData, false);
    }
    else{
      draw(true, 0, currData);
    }
    });
  });
});

function getYears(array){
  var years = [];
  array.forEach(function(record){ years.push(record.year); });
  return years;
}

function toggle(selector, context, disable){
  $(selector, context).prop('disabled', disable);
}

function index(arr, year){
  for(var i=0; i<arr.length; i++){
    if(arr[i].year === year) return i;
  }
  return -1;
}