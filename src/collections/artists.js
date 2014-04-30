var Artists = require( '../db' ).Collection.extend({
    model: Artist
});

global.Artists = Artists;
module.exports = Artists;
