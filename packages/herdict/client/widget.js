Template.HerdictWidget.onCreated(function() {
  var template = this;
  this.autorun(function() {
    template.subscribe('herdict_country_lists', Template.currentData().country.code);
  });
});

Template.HerdictWidget.helpers({
  sites: function() {
    var lists = CountryLists.findOne({ 'country.code': this.country.code }).lists;
    var list = _.findWhere(lists, { category: this.category.name });
    return list ? list.sites : [];
  }
});
