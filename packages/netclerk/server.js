var updateData = function() {
  var jsonData = HTTP.get( 'http://netclerk.dev.berkmancenter.org/statuses' );
  
  RecentlyChanged.upsert({ $set: { lists: lists } });
    });
  });
};

updateData();

Meteor.publish( 'netclerk_recently_changed', function() {
  return CountryLists.all() );
});
