Template.UsersDashboards.helpers({
  dashParams: function() { return { _id: this._id }; },
  title: function() {
    return this.getTitle();
  }
});
