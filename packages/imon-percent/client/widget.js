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
    var base = Template.currentData().base; // default: 100
    var countryName = IMonCountries.findOne({ code: Template.currentData().country }).name;
    var indicatorName = IMonIndicators.findOne({ id: currId }).shortName;
    var format = Template.currentData().form;

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

    var getFactor = function(base){
      //    The factors are mainly from trial-and-error. Would rather just adjust/ reduce if there's overflow
      //    instead of make it bigger until it can't be any bigger within the boundaries.
      var factor = 0;
      if(base<=10)
        factor = 5;
      else if (base<=15 && base>10)
        factor = 3;
      else if (base<=30 && base>15)
        factor = 2.5;
      else if (base<=50 && base>30)
        factor = 2;
      else if (base<=70 && base>50)
        factor = 1.5;
      else if (base<=90 && base>70)
        factor = 1;
      return factor;
    };

    var draw = function(){
      // a. Calculate values
      var value = parseInt((( indicatorValue * base ) / 100).toFixed(0));
      var icon = currId in Settings.icons ? Settings.icons[currId] : 'user';


      // b. Empty the node & fill out titles
      $(node).empty();
      $('h1', title).text(indicatorName.replace(' (%)', ''));
      $('h2', title).text(countryName);

      // c. Draw
      var sizeYNum = getFactor(base) + parseInt($(widgetNode).attr('data-sizey'));
      var sizeY = sizeYNum + 'em';
      $(node).css('font-size', sizeY);

      for(var i=0; i<base; i++){
        var colored = i < value ? 'colored' : 'plain';
        $(node).append('<i class="fa fa-' + icon + ' ' + colored + '"></i>');
      }

      $(valuePlace).css('font-size', '5em');
      if( format == 'percent'){
        var valueFull = indicatorValue.toFixed(0);
        $(valuePlace).text(valueFull + '%');
      }
      else{
        $(valuePlace).html(value+'/'+base);
      }
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
      }, 500);
      redrawn = true;
    }

  });
});

