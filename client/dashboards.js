Template.DashboardsShow.helpers(Widgets.templateHelpers);

Template.DashboardsShow.helpers({
  widgetId: function(aspect) {
    aspect = aspect || 'widget';
    return this.fromPackage + '-' + this._id + '-' + aspect;
  },
});

Template.DashboardsShow.events({
  'click a.add-widget': function(event, template) {
    var exported = Package[this.fromPackage][this.exports],
        widgetAttrs = _.pick(this, 'fromPackage', 'exports');
    var subscriptions = _.map(exported.publications, function(pub) {
      return Meteor.subscribe(pub, function() { console.log('sub'); });
    });
    console.log('starting');
    console.log(_.map(subscriptions, function(sub) { return sub.ready(); }));

    console.log(_.some(subscriptions, function(sub) { return !sub.ready(); }));
    console.log('ending');

        widget = new exported.constructor(widgetAttrs);
    $('.add-widget-modal').modal('hide');
    Meteor.call('addWidgetToDashboard', template.data._id, widget);
  }
});

Template.DashboardsShow.rendered = function() {
  $('body').popover({
    selector: '[data-toggle="popover"]',
    content: function() { return $('.my-popover-content.for-' + this.id).html(); }
  });
};
