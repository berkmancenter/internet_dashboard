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

Template.NetClerkWidget.onRendered( function( ) {
  var template = this;

  this.autorun( function( ) {
    if ( !template.subscriptionsReady() ) {
      return;
    }

    function animLoop( render, element ) {
      var running, lastFrame = +new Date;

      function loop( now ) {
        // stop the loop if render returned false
        if ( running !== false ) {
          requestAnimationFrame( loop, element );
          running = render( now - lastFrame, element );
          lastFrame = now;
        }
      }

      loop( lastFrame );
    }

    // TODO: is there a better way to guarantee that the template has rendered?
    setTimeout( function( ) {
      var ul = template.$( 'ul' )[ 0 ];
      var left = 0.0;

      if ( ul ) {
        animLoop( function( deltaT, element ) {
          if ( deltaT > 0 ) {
            element.style.left = ( left -= ( 0.1 * deltaT / 16.0 ) ) + "em";
          }
        }, ul );
      }
    }, 500 );
  } );
} );
