Package.describe( {
  name: 'netclerk',
  version: '0.3.0',
  summary: 'Ticker showing changes to whether or not web content is being censored in various countries'
} );

Package.onuse( function( api ) {
  api.versionsFrom( '1.1.0.2' );

  api.use( [ 'widget', 'mongo' ] );

  api.use( [ 'templating' ], 'client' );

  //api.use( [ ], 'server' );

  api.addFiles( [ 'netclerk.js' ] );

  api.addFiles( [
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css'
  ], 'client' );
    
  api.export( 'NetClerk' );
} );
