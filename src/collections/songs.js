var Songs = require( '../db' ).Collection.extend({
    model: Song
});

module.exports = Songs;
