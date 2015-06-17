var updateData = function() {
  var jsonData = HTTP.get( 'http://netclerk.dev.berkmancenter.org/statuses.json' );
  
  RecentlyChanged.remove( {} );
  RecentlyChanged.insert( { statuses: jsonData } );
};

updateData();

Meteor.setInterval( updateData, moment.duration({ hours: 24 }).asMilliseconds() );

Meteor.publish( 'netclerk_recently_changed', function() {
  return RecentlyChanged.find();
});
