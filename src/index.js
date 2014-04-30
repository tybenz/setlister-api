var server = require( './server' );
var routes = require( './routes.js' );
var Router = require( 'paper-router' ).extend({
    buildCallback: function( fn ) {
        return function( req, res, next ) {
            var data = fn( req.params );
            data.result.then( function ( obj ) {
                if ( data.callback ) {
                    obj = data.callback( obj );
                }

                res.send( obj );
            }).done();
        };
    },
});
var router = new Router( server, routes, __dirname + '/controllers' );

// [IMPORTANT] Autoloads all models/collections into global namespace
var autoloadedModules = require( './autoload' );

server.listen( process.env.PORT || 8083, function() {
  console.log( '%s listening at %s', server.name, server.url );
});
