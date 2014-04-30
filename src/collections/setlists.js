var Setlists = require( '../db' ).Collection.extend({
    model: Setlist
});

global.Setlists = Setlists;
module.exports = Setlists;
