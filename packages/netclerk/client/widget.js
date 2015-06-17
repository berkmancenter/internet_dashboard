Template.NetClerkWidget.helpers( {
  statuses: function( ) {
    function shuffle(array) {
      // Fisher-Yates (aka Knuth) Shuffle ( https://github.com/coolaj86/knuth-shuffle )
      var currentIndex = array.length, temporaryValue, randomIndex ;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }



    return shuffle( RecentlyChanged.findOne().statuses.data );
  },
  isUp: function( delta ) { return delta < 0 },
  pageDisplay: function( page ) {
    var l = document.createElement("a");
    l.href = page.url;
    return l.hostname.replace( /www\./, '' );
  },
  valueDisplay: function( value ) {
    var values = [
      'available',
      'a bit different',
      'very different',
      'not available'
    ];
    return values[ value ];
  },
  deltaDisplay: function( delta ) {
    return Math.abs( delta );
  }
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
    Meteor.setTimeout( function( ) {
      var ul = template.$( 'ul' )[ 0 ];
      var left = 0.0;

      if ( ul ) {
        ul.style.left = "0em";

        animLoop( function( deltaT, element ) {
          if ( deltaT > 0 ) {
            element.style.left = ( left -= ( 0.1 * deltaT / 16.0 ) ) + "em";
          }
        }, ul );
      }
    }, 500 );
  } );
} );
