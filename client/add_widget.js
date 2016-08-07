Template.DashboardsAdd.onCreated(function(){
  var template = this;
  template.subscribe('imon_indicators_v2');
  template.subscribe('imon_countries_v2');
  template.subscribe('country_attacks');
  template.subscribe('kasp_metrics');
});

Template.DashboardsAdd.onRendered(function() {
  var template = this;
  template.$grid = template.$('.add-widget-grid').isotope({
    itemSelector: '.addable-widget',
    layoutMode: 'fitRows',
    isInitLayout: false,
    sortBy: 'name',
    getSortData: {
      name: 'h2',
      org: function(elem) { return $(elem).find('.provided-by a').text() || 'ZZZZ'; },
      category: function(elem) { return $(elem).find('.package-category').text() || 'ZZZZ'; },
      type: function(elem) { return $(elem).find('.widget-type-icon').attr('class') || 'ZZZZ'; },
    }
  });
  template.$('.modal-body > *').css('visibility', 'hidden');
  template.$('.add-widget-modal').one('shown.bs.modal', function() {
    template.$grid.isotope();
    template.$('.modal-body > *').hide().css('visibility', '').fadeIn(200);
  });
});

Template.DashboardsAdd.helpers({
  widgetPackages: function() {
    return WidgetPackages.find({}, { sort: { sortPosition: 1 } });
  },
  categoryStyle: function() {
    return 'background-color: ' + tinycolor(this.category().color).lighten(35);
  },
  indicator: function(){
    return IMonIndicators.find({}, { sort: { shortName: 1 } });
  },
  country: function(){
    return IMonCountries.find({}, { sort: { name: 1 } });
  },
  thisYear: function(){
    return new Date().getFullYear();
  }
});

Template.DashboardsAdd.events({
  'click .sort-by-btn-group button': function(ev, template) {
    template.$('.sort-by-btn-group button').removeClass('active');
    template.$grid.isotope({ sortBy: $(ev.target).addClass('active').data('sort-by') });
  },
  'shown.bs.modal .add-widget-modal': function(ev, template) {
    template.$grid.isotope('layout');
  },
  'click .btn-add-widgets': function(ev, template) {
    var dashboard = Template.parentData();
    var addedWidgets = template.$('input[type=checkbox]:checked').map(function() {
      $(this).prop('checked', false);
      return $(this).attr('id').replace(/^checkbox-/, '');
    }).get();
    WidgetPackages
      .find({ packageName: { $in: addedWidgets }})
      .forEach(function(package, i) {
        var widgetAttrs = _.pick(package, 'packageName', 'exportedVar');
        widgetAttrs.typeId = package._id;

        Meteor.setTimeout(function() {
          var widget = Widget.construct(widgetAttrs);
          dashboard.addWidget(widget);
        }, i * Dashboard.Settings.addWidgetDelay);
      });
    template.$('.add-widget-modal').modal('hide');
  },
  'submit .filter-form': function(ev, template){
    ev.preventDefault();
    template.$('#error').remove();
    var mode = $('.active', template.find('.filter-mode-group')).prop('id');
    if(mode === 'filter-indicator'){
      var packages = filter({
        indicator: template.find('.filter-indicator').value,
        countryNumber: template.find('.filter-country').value,
        countries: template.find('.filter-countries').value 
      });
      var count = 0;
      template.$('.addable-widget').each(function(e, i){
        if(packages.indexOf($(this).prop('id')) === -1){ $(this).hide(); }
        else{ $(this).show(); count++; }
      });
      template.$grid.isotope();
      if(count===0){
        template.$('.modal-body').append('<div id="error"><h3>No widgets found for that filter.</h3></div>');
      }
    }
    else if(mode === 'filter-year' && (template.find('.filter-year').value >=1900 && template.find('.filter-year').value <= new Date().getFullYear())){
      Meteor.call('getYearIndicators', template.find('.filter-year').value, function(error, result){
        var indicators = get(result, 'indAdminName');
        var packages = filter({
          indicator: indicators,
          countryNumber: template.find('.filter-country').value,
          countries: template.find('.filter-countries').value
        });
        var count = 0;
        template.$('.addable-widget').each(function(e, i){
          if(packages.indexOf($(this).prop('id')) === -1){ $(this).hide(); }
          else{ $(this).show(); count++; }
        });
        template.$grid.isotope();
        if(count===0){
          template.$('.modal-body').append('<div id="error"><h4>No widgets found for that filter.</h4></div>');
        }
      });
    }
  },
  'click .clear-filter': function(ev, template){
    template.$('#error').remove();
    template.$('.addable-widget').show();
    template.$grid.isotope();
  },
  'click .filter-mode-btn': function(ev, template){
    var undo = false; 
    if($(ev.target).hasClass('active')){ undo = true; }
    template.$('.filter-mode-btn').removeClass('active');
    var mode = $(ev.target).prop('id');
    var hide = mode === 'filter-year' ? 'filter-indicator' : 'filter-year';
    template.$('.'+hide).hide();
    if(!undo) {template.$('.'+mode).show(); $(ev.target).addClass('active');}
    else{ template.$('.'+mode).hide(); }
  }
});

function filter(options){
  /**
   * Returns a selector for the widgets that should be shown
   * options = {
   *  indicator: STRING, adminName of indicator OR 'any-indicators' OR 'all-indicators',
   *  countryNumber: STRING, 'single', 'multi', or 'either',
   *  countries: STRING, country codes that should be included
   * }
  **/
  var ids = [];
  if(_.isArray(options.indicator) && options.indicator.length===0){ return []; }

  WidgetPackages.find().forEach(function(package){
    var widgetIndicators = package.metadata().widget.indicators;
    var widgetNumberOfCountries = package.metadata().widget.country;
    var widgetCountries = package.metadata().widget.countries;

    // 1. Filter out those whose number of countries don't match
    if(options.countryNumber !== 'either' && (options.countryNumber !== widgetNumberOfCountries) && widgetNumberOfCountries !== 'both'){ return; } 

    // 2. Filter out those whose indicators don't match
    if((_.isUndefined(widgetIndicators) && options.indicator !== 'any-indicators') || (options.indicator === 'all-indicators' && widgetIndicators !== 'all')){ return; }
    if(options.indicator !== 'any-indicators' && options.indicator !== 'all-indicators'){
      if(_.isString(options.indicator)){ options.indicator = [ options.indicator ]; }
      var indicators = _.isString(widgetIndicators) && widgetIndicators !== 'all' ? get(IMonIndicators.find({ displayClass: widgetIndicators }).fetch(), 'adminName') : widgetIndicators === 'all' ? get(IMonIndicators.find().fetch(), 'adminName') : widgetIndicators;
      if(arrayIntersection(options.indicator, indicators) === 0){ return; }
    }

    // 3. Filter out those who don't display the selected country
    if(options.countries !== 'any-country'){
      var countries = [];
      if(_.isUndefined(widgetCountries)) { return; }
      else if(_.isArray(widgetCountries)){ countries = normalizeCountryArray(widgetCountries); }
      else{
        switch(widgetCountries){
          case 'all':
            countries = get(IMonCountries.find().fetch(), 'code');
            break;
          case 'CountryAttacks':
            countries = normalizeCountryArray(get(CountryAttacks.find().fetch(), 'countryCode'));
            break;
          case 'CountryInfo':
            countries = normalizeCountryArray(get(CountryInfo.countries, 'name'), true);
            break;
          case 'CountryMetrics':
            countries = normalizeCountryArray(get(CountryMetrics.find().fetch(), 'name'), true);
            break;
          default:
            countries = get(IMonCountries.find({ dataSources: widgetCountries }).fetch(), 'code');
            break;
        }
      }
      if(countries.indexOf(options.countries) === -1){ return; }
    }

    // Finally, if it wasn't filtered out yet, add it.
    ids.push(package.packageName);
  });

  return ids;
}

function get(records, field){
  var result = [];
  for(var i=0; i<records.length; i++){
    result.push(records[i][field]);
  }
  return result;
}

function normalizeCountryArray(array, isNames){
  // Assumes for any given country array, everything is consistent (length and case)
  var res = [];
  var names = isNames ? array : [];
  var sample = array[0];
  if(!isNames && sample.length == 2){
    for(var i=0; i<CountryInfo.countries.length; i++){
      if(array.indexOf(CountryInfo.countries[i].code)!== -1){ names.push(CountryInfo.countries[i].name);}
    }
  }
  else if(!isNames && sample.length == 3){ res = array; }
  
  if(names.length>0) IMonCountries.find({ name: { $in: names } }).forEach(function(country){ res.push(country.code); });

  return arrayToLower(res);
}

function arrayToLower(array){
  var result = [];
  for(var i=0; i<array.length; i++){
    result.push(array[i].toLowerCase());
  }
  return result;
}

function arrayIntersection(arr1, arr2){
  var count = 0;
  for(var i=0; i<arr1.length; i++){
    if(arr2.indexOf(arr1[i])!== -1) { count++; }
  }
  return count;
}


