Template.HerdictWidget.onCreated(function() {
  var template = this;
  this.autorun(function() {
    template.subscribe('herdict_country_lists', Template.currentData().country.code);
  });
});

Template.HerdictWidget.helpers({
  sites: function() {
    var country = CountryLists.findOne({ 'country.code': this.country.code });
    if (!country) { return []; }
    var lists = country.lists;
    var list = _.findWhere(lists, { category: this.category.name });
    return list ? list.sites : [];
  }
});
