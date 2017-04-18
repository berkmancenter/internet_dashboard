Template.IMonPercentWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_indicators'); // for provider data
    template.subscribe('imon_indicators_v2');
    template.subscribe('imon_countries_v2');
    if(Template.currentData().indicatorName){
      template.subscribe('imon_data_v2', Template.currentData().country, Template.currentData().indicatorName, !Template.currentData().byYear);
    }
  });
});
Template.IMonPercentWidget.onRendered(function(){
  var template = this;
  var redrawn = false;
  template.autorun(function(){
    if (!template.subscriptionsReady()) { return; }
    // Make sure indicator is in the right format
    if(Template.currentData().indicatorId && !Template.currentData().indicatorName){ // because old structure used indicatorId
        var adName = IMonMethods.idToAdminName(Template.currentData().indicatorId);
        var newData = {
          indicatorName: adName
        };
        Template.currentData().set(newData);
    }

    // 1. Set indicator for the top right corner
    var cachedIndicator = Template.currentData().indicator;
    var currName = Template.currentData().indicatorName;
    var currId = IMonIndicators.findOne({ adminName: currName }).id;
    if(!cachedIndicator || cachedIndicator.id !== currId){
      Template.currentData().set({ indicator: IMonIndicatorsD.findOne({ id: currId })});
    }

    // 2. All the variables
    var widgetNode = template.firstNode.parentNode.parentNode;
    var $widgetBody = $(widgetNode).find('.widget-body');
    var node = template.find('.online-users');
    var nodeRow = template.find('.nodeRow');
    var container = template.find('.users-container');
    var title = template.find('.percent-title');
    var valuePlace = template.find('.indicator-value');
    var IMon = Template.currentData().byYear ? IMonData : IMonRecent;
    var selector = { indAdminName: Template.currentData().indicatorName, countryCode: Template.currentData().country }; 
    if(Template.currentData().byYear){ selector.$where = function(){ return this.date.getFullYear() === Template.currentData().chosenYear; }; }
    var record = IMon.findOne(selector, { $sort: { date: -1 } });
    if(_.isUndefined(record)){ return; }
    var indicatorValue = record.value;
    var countryName = IMonCountries.findOne({ code: Template.currentData().country }).name;
    var indicatorName = IMonIndicators.findOne({ adminName: currName }).shortName;
    var color = Template.currentData().color;
    var showCountry = Template.currentData().widget.showCountry();

    // 3. All the functions
    var setDims = function(){ // Set height for the container of the icons
      var h =  $(widgetNode).innerHeight() - $('.title-bar', widgetNode).height() - $(nodeRow).position().top;
      $(container).height(h);
      $(valuePlace.parentNode).height(h);
    };

    var readjust = function(){
      var s = $(node).css('font-size').replace('px', '');
      while(container.scrollHeight > container.clientHeight){
        s*=0.9;
        $(node).css('font-size', s + 'px');
      }
    };


    var draw = function(){
      // a. Calculate values
      var value = parseInt((indicatorValue).toFixed(0));
      var icon = currName in Settings.icons ? Settings.icons[currName] : 'user';


      // b. Empty the node & fill out titles
      $(node).empty();
      $('h1', title).text(indicatorName.replace(' (%)', ''));
      if (showCountry) {
        $('h2', title).text(countryName);
      }

      // c. Draw
      var sizeYNum =  parseInt($(widgetNode).attr('data-sizey'));
      var sizeY = sizeYNum + 'em';
      $(node).css('font-size', sizeY);

      for(var i=0; i<100; i++){
        var colored = i < value ? 'colored' : 'plain';
        $(node).append('<i class="fa fa-' + icon + ' ' + colored + '"></i>');
      }
      $(template.findAll('.colored')).css('color', color);
      $(valuePlace).css('font-size', '5em');
      var valueFull = indicatorValue.toFixed(0);
      $(valuePlace).text(valueFull + '%');
      var sizeXNum = $(valuePlace).css('font-size').replace('px', '');
      while(valuePlace.parentNode.scrollWidth > valuePlace.parentNode.clientWidth || valuePlace.parentNode.scrollHeight > valuePlace.parentNode.clientHeight){
        sizeXNum*=0.9;
        $(valuePlace).css('font-size', sizeXNum);
      }


      // d. Set dimensions for icons
      readjust();

    };



    // 4. Event handlers
    $(widgetNode).on('gridster:resizestop', function() {
      setDims();
      draw();
    });

    // 5. Flow
    setDims();
    draw();

    if(!redrawn){ // Yet to determine why a variation of this always works.
      Meteor.setTimeout(function(){
        setDims();
        draw();
      }, 500);
      redrawn = true;
    }

  });
});

