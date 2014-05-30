var server = require( './server' );

// Instantiating a paper router sets up route bindings to controller actions
// Actual route declarations are defined in routes.js
var Router = require( 'paper-router' );
var routes = require( './routes' );
var router = new Router( server, __dirname + '/controllers', routes );

// [IMPORTANT] Autoloads all models/collections into global namespace
require( './autoload' );

server.post( '/test/:id', function(req, res, next) {
    res.send('WORKED!');
});

server.listen( process.env.PORT || 8089, function() {
  console.log( '%s listening at %s', server.name, server.url );
});
