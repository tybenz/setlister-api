var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var GroupsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( params, currentUser ) {
        var groups = new Groups();

        return {
            result: groups.fetch({
                withRelated: [ 'users' ]
            })
        };
    },

    show: function( params, currentUser ) {
        var group = new Group( { id: params.id } );
        return {
            result: group.fetch({
                withRelated: [ 'users', 'songs', 'setlists' ]
            })
        };
    },

    // The user who creates the group is added to it
    create: function( params, currentUser ) {
        var group = new Group( _.pick( params, 'title' ) );

        var result = group.save().then( function( group ) {
            var groupUser = new GroupUser({
                user_id: currentUser.id,
                group_id: group.id
            });

            groupUser.save();

            return group;
        });

        return { result: result };
    },

    update: function( params, currentUser ) {
        var group = new Group( { id: params.id } );

        var result = group.fetch({
            withRelated: [ 'users' ]
        })
        .then( function( group ) {
            if ( !group || !group.related( 'users' ) ) {
                throw new Error( 'That group was not found.' );
            }

            var user = group.related( 'users' ).findWhere( { id: currentUser.id } );
            if ( !user && !currentUser.isAdmin() ) {
                throw new Error( 'You don\'t have access to that group' );
            }

            return group.save( _.pick( params, [ 'title' ] ) );
        });

        return { result: result };
    },

    destroy: function( params, currentUser ) {
        var group = new Group( { id: params.id } );

        return { result: group.destroy() };
    }
};

module.exports = GroupsController;
