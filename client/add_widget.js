Template.DashboardsAdd.onCreated(function(){
  var template = this;
  template.subscribe('imon_indicators_v2');
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
  'click .filter-submit': function(ev, template){
    var packages = filter({
      indicator: template.find('.filter-indicator').value,
      countryNumber: template.find('.filter-country').value  
    });
    template.$('.addable-widget').each(function(e, i){
      if(packages.indexOf($(this).prop('id')) === -1){ $(this).hide(); }
      else{ $(this).show(); }
    });
    template.$grid.isotope();
  },
  'click .clear-filter': function(ev, template){
    template.$('.addable-widget').show();
    template.$grid.isotope();
  }
});

function filter(options){
  /**
   * Returns a selector for the widgets that should be shown
   * options = {
   *  indicator: STRING, adminName of indicator OR 'any-indicators' OR 'all-indicators',
   *  year: NUMBER, year that needs to be included,
   *  countryNumber: STRING, 'single', 'multi', or 'either',
   *  countries: ARRAY, country codes that should be included
   * }
  **/
  var ids = [];
  WidgetPackages.find().forEach(function(package){
    var widgetIndicators = package.metadata().widget.indicators;
    var widgetNumberOfCountries = package.metadata().widget.country;

    // 1. Filter out those whose number of countries don't match
    if(options.countryNumber !== 'either'){ if((options.countryNumber !== widgetNumberOfCountries) && widgetNumberOfCountries !== 'both'){ return; } } 

    // 2. Filter out those whose indicators don't match
    if((_.isUndefined(widgetIndicators) && options.indicator !== 'any-indicators') || (options.indicator === 'all-indicators' && widgetIndicators !== 'all')){ return; }
    if(options.indicator !== 'any-indicators' && options.indicator !== 'all-indicators'){
      var indicators = _.isString(widgetIndicators) && widgetIndicators !== 'all' ? getAdminNames(IMonIndicators.find({ displayClass: widgetIndicators }).fetch()) : widgetIndicators === 'all' ? getAdminNames(IMonIndicators.find().fetch()) : widgetIndicators;
      if(indicators.indexOf(options.indicator) === -1){ return; }
    }

    // Finally, if it wasn't filtered out yet, add it.
    ids.push(package.packageName);
  });
  
  return ids;
}

function getAdminNames(records){
  var result = [];
  for(var i=0; i<records.length; i++){
    result.push(records[i].adminName);
  }
  return result;
}


