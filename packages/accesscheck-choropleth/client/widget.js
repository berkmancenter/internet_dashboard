Template.AccessCheckChoroplethWidget.helpers({
  ready: function(){
    var id = Template.instance().data.widget._id;
    return Session.get(id+'-ready');
  },
  header: function(){ 
    return Template.currentData().url ? Template.currentData().url.replace(/https?:\/\//, '') : 'No specified link';
  }
});

Template.AccessCheckChoroplethWidget.onRendered(function() {
  var template = this;
  var id = Template.instance().data.widget._id;

  template.autorun(function() {
    Session.set(id+'-ready', false);
    template.$('.accesscheck-choropleth-data').hide();
    template.$('.accesscheck-error').empty();
    if (!template.subscriptionsReady() || !Template.currentData().url) {  return;  }

    var svg, height = Settings.map.height, currData = Template.currentData();

    Meteor.call('getAccessData', currData.url, function(error, result){
      Session.set(id+'-ready', true);
      if(!result.isOK){
       template.$('.accesscheck-error').text('An error occurred while trying to retrieve the data. Please try again later.');
       return; 
     }
     else if(result.data.length === 0){
        template.$('.accesscheck-error').text('No test data available for this URL yet.');
        return;
     }
      var draw = function(){
      // 1. Common
          var countryDataByCode = {};
          var countries = result.data; // get list of all countries
          for(var i=0; i<countries.length; i++){
            var d = countries[i].attributes;
            var currCode = d.countryCode;
            countryDataByCode[currCode.toUpperCase()] = d;
          }

          var colorScale;
          colorScale = d3.scale.ordinal()
            .domain(Object.keys(Settings.colors))
            .range(colorValues(Settings.colors));

          var projection = d3.geo.winkel3()
          .scale(Settings.map.scale)
          .translate([
            Settings.map.width / 2 - Settings.map.bumpLeft,
            height / 2 + Settings.map.bumpDown
          ])
          ;

        var legend = d3.legend.color()
          .scale(colorScale)
          .labelOffset(3)
          .cells(3)


        // 2. Init function
        var init = function(){
          template.$('.accesscheck-choropleth-data').empty();
          template.$('.accesscheck-choropleth-data').show();
          svg = d3.select(template.find('.accesscheck-choropleth')).append("svg:svg")
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
                  var country = countryDataByCode[d.iso2];
                  // We have country data. Make it pretty.
                  if (country) {
                    return formatColor(Settings.colors[country.status], country.statusConfidence);
                  } else {
                    // No data for this country. Make it gray or something.
                    return  'rgb(186,186,186)';
                  }
                })
                .style('transform', 'scaleY(' + Settings.map.squash + ')')
                .attr("d", d3.geo.path().projection(projection));
            feature.append("title")
            .text(function(d) {
                var title = d.properties.name;
                var country = countryDataByCode[d.iso2];
                if (country) {
                  return title + ': ' + country.status + ' (' + country.statusConfidence * 100 + '% confidence)';
                }
                return title + ' (No data)';
              });         
          });
      };
      init(); 
      svg.select(".legend")
        .call(legend);
    };
    draw();

    });
  });
});

function colorValues(obj){
  var arr = [];
  Object.keys(obj).forEach(function(key){
    var c = obj[key];
    arr.push('rgb(' + c.r + ',' + c.g + ',' + c.b + ')');
  });
  return arr;
}

function formatColor(obj, alpha){
  return 'rgba(' + obj.r + ',' + obj.g + ',' + obj.b + ',' + alpha + ')';
}
