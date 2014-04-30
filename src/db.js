var Bookshelf = require( 'bookshelf' );

var PG = Bookshelf.initialize({
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: 'localhost',
    user: 'vagrant',
    password: 'postgres',
    database: 'setlister-dev',
    charset: 'utf-8'
  }
});

module.exports = PG;
