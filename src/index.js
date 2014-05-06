var server = require( './server' );

// Instantiating a paper router sets up route bindings to controller actions
// Actual route declarations are defined in routes.js
var Router = require( 'paper-router' ).extend({
    // My version of build callback wraps the controller actions
    // in a restify-aware callback
    // Since each controller just returns a promise that resolves to a
    // collection/model, any post-processing that has to be done on the data
    // is returned as a callback. The promise is in data.result
    buildCallback: function( fn ) {
        return function( req, res, next ) {
            var data = fn( req.params, req.user );
            data.result.then( function ( obj ) {
                if ( obj ) {
                    if ( data.callback ) {
                        obj = data.callback( obj );
                    }

                    res.send( obj );
                } else {
                    res.send( { error: 'Not found' } );
                }
            }).done();
        };
    },
});
var routes = require( './routes' );
var router = new Router( server, __dirname + '/controllers', routes );

// [IMPORTANT] Autoloads all models/collections into global namespace
require( './autoload' );

server.post( '/test/:id', function(req, res, next) {
    res.send('WORKED!');
});

server.listen( process.env.PORT || 8083, function() {
  console.log( '%s listening at %s', server.name, server.url );
});
