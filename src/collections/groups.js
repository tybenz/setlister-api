var Groups = require( '../db' ).Collection.extend({
    model: Group
});

global.Groups = Groups;
module.exports = Groups;
