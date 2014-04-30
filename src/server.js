var restify = require( 'restify' );
var Bookshelf = require( 'bookshelf' );
var server = restify.createServer({
  name: 'luca',
  version: '0.0.0'
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

module.exports = server;
