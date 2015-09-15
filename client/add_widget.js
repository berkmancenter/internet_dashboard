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
      .forEach(function(package) {
        var widgetAttrs = _.pick(package, 'packageName', 'exportedVar');
        widgetAttrs.typeId = package._id;

        var widget = Widget.construct(widgetAttrs);
        dashboard.addWidget(widget);
      });
    template.$('.add-widget-modal').modal('hide');
  }
});
