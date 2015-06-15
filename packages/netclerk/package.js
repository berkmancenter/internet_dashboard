Package.describe( {
  name: 'netclerk',
  version: '0.3.0',
  summary: 'Ticker showing changes to whether or not web content is being censored in various countries'
} );

Package.onUse( function( api ) {
  api.versionsFrom( '1.1.0.2' );

  api.use( [ 'widget', 'mongo', 'underscore' ] );

  api.use( [ 'templating' ], 'client' );

  //api.use( [ ], 'server' );

  api.addFiles( [ 'netclerk.js' ] );

  api.addFiles( 'server.js', 'server' );

  api.addFiles( [
    'client/widget.html',
    'client/widget.css',
    'client/widget.js'
  ], 'client' );
    
  api.export( 'NetClerk' );
} );
