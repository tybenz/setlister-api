var server = require( './server' );
var routes = require( './routes.js' );
var inflect = require( 'i' )();
var fs = require( 'fs' );
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

// Require the base model first
require( './models/model' );
// Require all models - puts them in global namespace
var modelList = fs.readdirSync( __dirname + '/../src/models' );
for ( var i = 0, len = modelList.length; i < len; i++ ) {
    var model = modelList[ i ];

    if ( model.charAt(0) != '.' && model.match( /\.js$/ ) ) {
        if ( model != 'model.js' ) {
            require( './models/' + model );
        }
    }
}

// Require all collections - puts them in global namespace
var collectionList = fs.readdirSync( __dirname + '/../src/collections' );
for ( var i = 0, len = collectionList.length; i < len; i++ ) {
    var collection = collectionList[ i ];

    if ( collection.charAt(0) != '.' && collection.match( /\.js$/ ) ) {
        require( './collections/' + collection );
    }
}

server.listen( process.env.PORT || 8083, function() {
  console.log( '%s listening at %s', server.name, server.url );
});
