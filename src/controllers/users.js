var passport = require( 'passport' );
var _ = require( 'lodash-node' );

var UsersController = {
    auth: function( action ) {
        if ( action != 'create' ) {
            return passport.authenticate( 'basic' );
        }
        return null;
    },

    index: function( req, res, next ) {
        var users = new Users();

        if ( !req.user.isAdmin() ) {
            throw new Error( 'You must be an admin to perform that action' );
        }

        users.fetch( { withRelated: [ 'groups' ] } )
        .then( function( users ) {
            res.send( users );
        });
    },

    show: function( req, res, next ) {
        new User( { id: req.params.id } )
        .fetch({
            withRelated: [ 'groups' ]
        })
        .then( function( user ) {
            res.send( user );
        });
    },

    create: function( req, res, next ) {
        var password = req.params.password;

        var user = new User( _.pick( req.params, [ 'email', 'fname', 'lname' ] ) );

        user.setPassword( password );

        user.save()
        .then( function( user ) {
            res.send( user );
        });
    },

    update: function( req, res, next ) {
        var user = new User( { id: req.params.id } );

        if ( !req.user.isAdmin() && req.user.id != req.params.id ) {
            throw new Error( 'You must be an admin to perform that action' );
        }

        user.save( req.params )
        .then( function( user ) {
            res.send( user );
        });
    },

    destroy: function( req, res, next ) {
        var user = new User( { id: req.params.id } );

        if ( !req.user.isAdmin() ) {
            throw new Error( 'You must be an admin to perform that action' );
        }

        user.destroy()
        .then( function( user ) {
            res.send( user );
        });
    }
};

module.exports = UsersController;
