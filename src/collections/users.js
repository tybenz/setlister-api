var Users = require( '../db' ).Collection.extend({
    model: User
});

module.exports = Users;
