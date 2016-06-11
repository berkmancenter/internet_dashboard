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
    var title = template.find('.percent-title');
    var valuePlace = template.find('.indicator-value');
    var indicatorValue = IMonData.findOne({ sourceId: Template.currentData().indicatorId, countryCode: Template.currentData().country }).value;
    var base = Template.currentData().base; // default: 100
    var countryName = IMonCountries.findOne({ code: Template.currentData().country }).name;
    var indicatorName = IMonIndicators.findOne({ id: currId }).shortName;

    // 3. All the functions
    var setDims = function(){
      var h =  $widgetBody.innerHeight() - $(node.parentNode.parentNode).position().top;
      $(node).height(h);
    };

    var draw = function(){
      var factor = 0;
      if(base<=10)
        factor = 3;
      else if (base<=30 && base>10)
        factor = 2;
      else if (base<=70 && base>30)
        factor = 1;
      var sizeY = (factor + parseInt($(widgetNode).attr('data-sizey'))) + 'em';
      var sizeXNum = parseInt($(widgetNode).attr('data-sizex')) > 3 ? 3 : parseInt($(widgetNode).attr('data-sizex'));
      var sizeX =  sizeXNum + 'em';
      var icon = currId in Settings.icons ? Settings.icons[currId] : 'user';
      var valueFull = indicatorValue.toFixed(0);
      var value = parseInt((( indicatorValue * base ) / 100).toFixed(0));
      $(node).empty();
      $('h1', title).text(indicatorName);
      $('h2', title).text(countryName);
      $(valuePlace).text(valueFull + '%');
      _(base).times(function(i) {
        var colored = i < value ? 'colored' : 'plain';
        $(node).append('<i class="fa fa-' + icon + ' ' + colored + '"></i>');
      });
      $(node).css('font-size', sizeY);
      $(valuePlace).css('font-size', sizeX);
    };

    // 4. Event handlers
    $(widgetNode).on('gridster:resizestop', function() {
      setDims();
      draw();
    });

    setDims();
    draw();
  });
});

