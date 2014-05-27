var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var GroupsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( req, res, next ) {
        var groups = new Groups();

        groups.fetch({
            withRelated: [ 'users' ]
        })
        .then( function( users ) {
            res.send( users );
        });
    },

    show: function( req, res, next ) {
        var group = new Group( { id: req.params.id } );

        group.fetch({
            withRelated: [ 'users', 'songs', 'setlists' ]
        })
        .then( function( group ) {
            res.send( group );
        })
    },

    // The user who creates the group is added to it
    create: function( req, res, next ) {
        var group = new Group( _.pick( req.params, 'title' ) );

        group.save().then( function( group ) {
            var groupUser = new GroupUser({
                user_id: req.user.id,
                group_id: group.id
            });

            groupUser.save();

            res.send( group );
        });
    },

    update: function( req, res, next ) {
        var group = new Group( { id: req.params.id } );

        var result = group.fetch({
            withRelated: [ 'users' ]
        })
        .then( function( group ) {
            if ( !group || !group.related( 'users' ) ) {
                throw new Error( 'That group was not found.' );
            }

            var user = group.related( 'users' ).findWhere( { id: req.user.id } );
            if ( !user && !req.user.isAdmin() ) {
                throw new Error( 'You don\'t have access to that group' );
            }

            return group.save( _.pick( req.params, [ 'title' ] ) );
        })
        .then( function( group ) {
            res.send( group );
        });
    },

    destroy: function( req, res, next ) {
        new Group( { id: req.params.id } ).destroy()
            .then( function( group ) {
                res.send( group );
            });
    }
};

module.exports = GroupsController;
