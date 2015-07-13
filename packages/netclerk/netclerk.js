RecentlyChanged = new Mongo.Collection( 'netclerk_recently_changed' );

NetClerkWidget = function( doc ) {
  Widget.call( this, doc );

  _.extend( this, {
    width: 3,
    height: 1
  } );

  _.defaults( this.data, {
    country: null
  } );
};

NetClerkWidget.prototype = Object.create( Widget.prototype );
NetClerkWidget.prototype.constructor = NetClerkWidget;

NetClerk = {
  widget: {
    name: 'URL Status by Country',
    description: 'Ticker showing changes to whether or not web content is being censored in various countries',
    url: 'http://netclerk.dev.berkmancenter.org/about',
    constructor: NetClerkWidget
  },
  org: {
    name: 'NetClerk',
    shortName: 'NetClerk',
    url: 'http://netclerk.dev.berkmancenter.org'
  }
};
