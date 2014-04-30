var restify = require( 'restify' );
var Bookshelf = require( 'bookshelf' );
var passport = require( 'passport' );
var BaseModel = require( './models/model' );
// var User = require( './models/user' );
var BasicStrategy = require( 'passport-http' ).BasicStrategy;
var server = restify.createServer({
  name: 'luca',
  version: '0.0.0'
});

passport.use( new BasicStrategy( {}, function ( email, password, done ) {
    process.nextTick( function() {
        new User( { email: email }).
            fetch().
            then( function ( model ) {
                if ( model && model.verify( password ) ) {
                    return done( null, model );
                }
                return done( null, false );
            });
    });
}));

passport.serializeUser( function( user, done ) {
    done( null, user.id );
});

passport.deserializeUser( function( id, done ) {
    new User( { id: id } ).fetch().then( function( user ) {
        done( null, user );
    });
});

server.use(
  function crossOrigin( req, res, next ) {
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Headers", "X-Requested-With" );
    return next();
  }
);
server.use( restify.acceptParser( server.acceptable ) );
server.use( restify.queryParser() );
server.use( restify.bodyParser() );
server.pre( restify.pre.sanitizePath() );
server.use( passport.initialize() );
server.use( passport.session() );

module.exports = server;
