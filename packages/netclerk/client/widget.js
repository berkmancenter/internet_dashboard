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

    return shuffle( RecentlyChanged.findOne().data );
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

    var ul = template.$( 'ul' );

    ul.removeClass( 'netclerk-transition' );
    ul.css( 'left', '20em' );

    var count = RecentlyChanged.findOne().data.length;

    ul.css( 'transitionDuration', ( count * 14 ) + 's' );
    ul.addClass( 'netclerk-transition' );
    ul.css( 'left', '-' + ( count * 60 + 20 ) + 'em' );
  } );
} );
