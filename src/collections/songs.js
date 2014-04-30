var Songs = require( '../db' ).Collection.extend({
    model: Song
});

global.Songs = Songs;
module.exports = Songs;
