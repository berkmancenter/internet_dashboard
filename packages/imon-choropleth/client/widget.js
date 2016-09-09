Template.IMonChoroplethWidget.onCreated(function() {
  var template = this;
  template.autorun(function(){
    template.subscribe('imon_indicators');
    template.subscribe('imon_indicators_v2');
    template.subscribe('imon_countries_v2');
  });
});

Template.IMonChoroplethWidget.helpers({
  year: function(){ 
    var id = Template.instance().data.widget._id;
    return Session.get(id+'-array') ? Session.get(id+'-array')[Session.get(id+'-current')] : '';
  },
  isLooping: function(){
    var id = Template.instance().data.widget._id;
    return Session.get(id+'-loop') ? 'shown' : 'hidden';
  },
  indicator: function(){
    return IMonIndicators.findOne({ adminName: Template.currentData().indicatorName }).shortName;
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

    var currData = Template.currentData();

    Meteor.call('getChoroplethData', currData.indicatorName, function(error, result){
      var map = new ChoroplethMap();
      var draw = function(isRecent, year, currentData, isFirst){
      // 1. Common
          var countryDataByCode = {};
          var countries = isRecent ? result : result[index(result, year)].records; // get list of all countries
          for(var i=0; i<countries.length; i++){
            var d = countries[i];
            var currCode = d.country;
            countryDataByCode[currCode.toUpperCase()] = d;
          }
        
        // 2. Init function
        var init = function(){
          map.draw({
            selector: template.find('.imon-choropleth-data'),
            data: countryDataByCode,
            dims: Settings.map,
            iso: 3,
            valueSuffix: Object.keys(Settings.suffix).indexOf(newIndicator.displayClass) !== -1 ? Settings.suffix[newIndicator.displayClass] : ''
          });
      };

      var update = function(){
        map.update({
          data: countryDataByCode
        });
      };
      if(isRecent || isFirst){ init(); }
      else{ update(); }
    };

      var buttonPlace = template.find('.choropleth-button');
      var arr = getYears(result);
      Session.set(id+'-array', arr);
      Session.set(id+'-current', arr.length - 1);
      var play = function(i, currentData, iterate){
        if(i!==0) toggle('#step-backward-button', buttonPlace, false);
        else toggle('#step-backward-button', buttonPlace, true); 

        if(i===arr.length-1) toggle('#step-forward-button', buttonPlace, true); 
        else toggle('#step-forward-button', buttonPlace, false);

        draw(false, arr[i], currentData, !iterate);
        Session.set(id+'-current', i);
        var loop = Session.get(id+'-loop');
        i++;
        if(i!==arr.length && iterate || i===arr.length && loop){
          i = loop && i===arr.length ? 0 : i;
          var playing = Meteor.setTimeout(function(){ play(i, currentData, true); }, 1000);
          $('#pause-button', buttonPlace).one('click', function(){
            Meteor.clearTimeout(playing);
            $(this).hide();
            $('#play-button', buttonPlace).show();
          });
        }
        else if(i===arr.length && !loop){
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
      $('#loop-button', buttonPlace).show();
      $('#step-forward-button', buttonPlace).show();
      $('#step-backward-button', buttonPlace).show();
      if(arr.length>1){
        toggle('#play-button', buttonPlace, false);
        toggle('#step-backward-button', buttonPlace, false);
        toggle('#step-forward-button', buttonPlace, false);
        toggle('#loop-button', buttonPlace, false);
        $('#play-button', buttonPlace).click(function(){
          $(this).hide();
          $('#pause-button', buttonPlace).show();
          var p = Session.get(id+'-current') === arr.length - 1 ? 0 :  Session.get(id+'-current');
          play(p, currData, true);
        });
        $('#step-backward-button', buttonPlace).off();
        $('#step-backward-button', buttonPlace).click(function(){
          moveCurrent(false, currData);
        });
        $('#step-forward-button', buttonPlace).off();
        $('#step-forward-button', buttonPlace).click(function(){
          moveCurrent(true, currData);
        });
        $('#loop-button', buttonPlace).off();
        $('#loop-button', buttonPlace).click(function(){
          var enabled = Session.get(id+'-loop');
          Session.set(id+'-loop', !enabled);
        });
      }
      else{
        toggle('#play-button', buttonPlace, true);
        toggle('#step-backward-button', buttonPlace, true);
        toggle('#step-forward-button', buttonPlace, true);
        toggle('#loop-button', buttonPlace, true);
      }
      play(arr.length - 1, currData, false);

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