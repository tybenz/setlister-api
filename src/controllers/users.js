var _ = require( 'lodash-node' );

var UsersController = {
    index: function( params ) {
        var users = new Users();
        return { result: users.fetch( { withRelated: [ 'groups' ] } ) };
    },

    show: function( params ) {
        var user = new User( { id: params.id } );
        return { result: user.fetch( { withRelated: [ 'groups' ] } ) };
    },

    create: function( params ) {
        var password = params.password;

        var user = new User( _.pick( params, [ 'email', 'fname', 'lname' ] ) );

        user.setPassword( password );

        return { result: user.save() };
    },

    update: function( params ) {
        var user = new User( { id: params.id } );

        return { result: user.save( params ) };
    },

    destroy: function( params ) {
        var user = new User( { id: params.id } );

        return { result: user.destroy() };
    }
};

module.exports = UsersController;
