Template.UsersDashboards.helpers({
  dashParams: function() { return { _id: this._id }; },
  title: function() {
    return this.title || 'Dashboard ' + this._id.slice(0, 5);
  }
});
