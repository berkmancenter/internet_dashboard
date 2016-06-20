Template.IMonPercentWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    var indicators = [ Template.currentData().indicatorId ];
    template.subscribe('imon_data', 'all', indicators, 'id');
    template.subscribe('imon_indicators');
    template.subscribe('imon_countries');
  });
});
Template.IMonPercentWidget.onRendered(function(){
  var template = this;
  var redrawn = false;
  template.autorun(function(){
    if (!template.subscriptionsReady()) { return; }
    // 1. Set indicator for the top right corner
    var cachedIndicator = Template.currentData().indicator;
    var currId = Template.currentData().indicatorId; 
    if(!cachedIndicator || cachedIndicator.id !== currId){
      Template.currentData().set({ indicator: IMonIndicators.findOne({ id: currId })});
    }

    // 2. All the variables
    var widgetNode = template.firstNode.parentNode.parentNode;
    var $widgetBody = $(widgetNode).find('.widget-body');
    var node = template.find('.online-users');
    var nodeRow = template.find('.nodeRow');
    var container = template.find('.users-container');
    var title = template.find('.percent-title');
    var valuePlace = template.find('.indicator-value');
    var indicatorValue = IMonData.findOne({ sourceId: Template.currentData().indicatorId, countryCode: Template.currentData().country }).value;
    var countryName = IMonCountries.findOne({ code: Template.currentData().country }).name;
    var indicatorName = IMonIndicators.findOne({ id: currId }).shortName;
    var color = Template.currentData().color;

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
      var icon = currId in Settings.icons ? Settings.icons[currId] : 'user';


      // b. Empty the node & fill out titles
      $(node).empty();
      $('h1', title).text(indicatorName.replace(' (%)', ''));
      $('h2', title).text(countryName);

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
      window.setTimeout(function(){
        setDims();
        draw();
      }, 200);
      redrawn = true;
    }

  });
});

