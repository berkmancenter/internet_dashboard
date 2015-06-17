Template.NetClerkWidget.helpers( {
  statuses: function( ) { return RecentlyChanged.findOne().statuses.data; },
  isUp: function( delta ) { return delta > 0 }
} );

Template.NetClerkWidget.onCreated( function( ) {
  var template = this;
  this.autorun( function( ) {
    template.subscribe( 'netclerk_recently_changed' );
  } );
} );
