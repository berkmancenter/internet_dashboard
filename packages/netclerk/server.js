var updateData = function() {
  var jsonData = HTTP.get( 'http://netclerk.dev.berkmancenter.org/statuses' );
  
  RecentlyChanged.remove( {} );
  RecentlyChanged.insert(jsonData);
};

updateData();

Meteor.publish( 'netclerk_recently_changed', function() {
  return RecentlyChanged.all();
});
