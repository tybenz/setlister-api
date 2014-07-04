var passport = require( 'passport' );
var _ = require( 'lodash-node' );

var UsersController = {
    auth: function( action ) {
        if ( action != 'create' && action != 'login' ) {
            return passport.authenticate( 'basic' );
        }
        return null;
    },

    index: function( req, res, next ) {
        var users = new Users();

        if ( !req.user.isAdmin() ) {
            res.send( 401, new Error( 'You must be an admin to perform that action' ) );
        }

        users
        .fetch( { withRelated: [ 'groups' ] } )
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
            res.send( 401, new Error( 'You must be an admin to perform that action' ) );
        }

        user.save( req.params )
        .then( function( user ) {
            res.send( user );
        });
    },

    destroy: function( req, res, next ) {
        var user = new User( { id: req.params.id } );

        if ( !req.user.isAdmin() ) {
            res.send( 401, new Error( 'You must be an admin to perform that action' ) );
        }

        user.destroy()
        .then( function( user ) {
            res.send( user );
        });
    }

    // login: function( req, res, next ) {
    //     new User( { email: req.params.email } )
    //     .fetch()
    //     .then( function( user ) {
    //         if ( user && user.verify( req.params.password ) ) {
    //             req.login( user, function( err ) {
    //                 if ( err ) return next( err );
    //                 return res.send( { message: 'Successfully logged in' } );
    //             });
    //         } else {
    //             res.send( 401, 'Incorrect email and/or password' );
    //         }
    //     });
    // },

    // logout: function( req, res, next ) {
    //     req.session.destroy( function ( err ) {
    //         res.send( { message: 'Successfully logged out' } );
    //     });
    // }
};

module.exports = UsersController;
