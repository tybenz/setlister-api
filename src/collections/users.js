var Users = require( '../db' ).Collection.extend({
    model: User
});

global.Users = Users;
module.exports = Users;
