var fs = require( 'fs' );
var inflect = require( 'i' )();
var modules = [];

// Require the base model first
global.BaseModel = require( './models/model' );

// Require all models - puts them in global namespace
fs.readdirSync( __dirname + '/../src/models' ).forEach( function( model ) {
    if ( model.charAt(0) != '.' && model.match( /\.js$/ ) && model != 'model.js' ) {
        var module = require( './models/' + model );
        modules.push( module );
        global[ inflect.camelize( model.replace( /\.js$/, '' ) ) ] = module;
    }
});

// Require all collections - puts them in global namespace
fs.readdirSync( __dirname + '/../src/collections' ).forEach( function( collection ) {
    if ( collection.charAt(0) != '.' && collection.match( /\.js$/ ) ) {
        var module = require( './collections/' + collection );
        modules.push( module );
        global[ inflect.camelize( collection.replace( /\.js$/, '' ) ) ] = module;
    }
});

module.exports = module;
