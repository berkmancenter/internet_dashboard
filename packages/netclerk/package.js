Package.describe( {
  name: 'netclerk',
  version: '0.3.0',
  summary: 'Ticker showing changes to whether or not web content is being censored in various countries'
} );

Package.onUse( function( api ) {
  api.versionsFrom( '1.1.0.2' );

  api.use( [ 'widget', 'mongo', 'underscore' ] );

  api.use( [ 'http' ], 'server' );

  api.use( [ 'templating' ], 'client' );

  api.addFiles( [ 'netclerk.js' ] );

  api.addFiles( 'server.js', 'server' );

  api.addFiles( [
    'client/widget.html',
    'client/widget.css',
    'client/widget.js',

    'client/info.html',

    'client/bpdotssquares_regular_macroman/BPdotsSquare-webfont.eot',
    'client/bpdotssquares_regular_macroman/BPdotsSquare-webfont.woff',
    'client/bpdotssquares_regular_macroman/BPdotsSquare-webfont.ttf',
    'client/bpdotssquares_regular_macroman/BPdotsSquare-webfont.svg'
  ], 'client' );
    
  api.export( 'NetClerk' );
} );
