var passport = require( 'passport' );
var _ = require( 'lodash-node' );

var UsersController = {
    auth: function( action ) {
        if ( action != 'create' ) {
            return passport.authenticate( 'basic' );
        }
        return null;
    },

    index: function( params, currentUser ) {
        var users = new Users();

        if ( !currentUser.isAdmin() ) {
            throw new Error( 'You must be an admin to perform that action' );
        }

        return { result: users.fetch( { withRelated: [ 'groups' ] } ) };
    },

    show: function( params, currentUser ) {
        var user = new User( { id: params.id } );
        return { result: user.fetch( { withRelated: [ 'groups' ] } ) };
    },

    create: function( params ) {
        var password = params.password;

        var user = new User( _.pick( params, [ 'email', 'fname', 'lname' ] ) );

        user.setPassword( password );

        return { result: user.save() };
    },

    update: function( params, currentUser ) {
        var user = new User( { id: params.id } );

        if ( !currentUser.isAdmin() && currentUser.id != params.id ) {
            throw new Error( 'You must be an admin to perform that action' );
        }

        return { result: user.save( params ) };
    },

    destroy: function( params, currentUser ) {
        var user = new User( { id: params.id } );

        if ( !currentUser.isAdmin() ) {
            throw new Error( 'You must be an admin to perform that action' );
        }

        return { result: user.destroy() };
    }
};

module.exports = UsersController;
