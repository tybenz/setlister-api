var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var GroupsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( params, user ) {
        var groups = new Groups();

        return {
            result: groups.fetch({
                withRelated: [ 'users' ]
            })
        };
    },

    show: function( params, user ) {
        var group = new Group( { id: params.id } );
        return {
            result: group.fetch({
                withRelated: [ 'users' ]
            })
        };
    },

    // The user who creates the group is added to it
    create: function( params, user ) {
        var group = new Group( _.pick( params, 'title' ) );

        return {
            result: group.save(),
            callback: function( group ) {
                var groupUser = new GroupUser({
                    user_id: user.id,
                    group_id: group.id
                });

                groupUser.save();

                return group;
            }
        };
    },

    update: function( params, user ) {
        var groupModel;

        var group = new Group( { id: params.id } );

        var result = group.fetch({
                withRelated: [ 'users' ]
            })
            .then( function( model ) {
                if ( !model ) {
                    throw new Error( 'That group was not found.' );
                }
                // Store actual model in groupModel
                groupModel = model;

                return model.users().fetch();
            }).then( function( collection ) {
                var u = collection.findWhere( { id: user.id } );

                // If u is null then the user does not belong
                // to the group they're trying to edit
                if ( !u ) {
                    throw new Error( 'You don\'t have access to that group.' );
                }

                // Pass back save() promise for router
                return groupModel.save( _.pick( params, [ 'title' ] ) );
            });

        return { result: result };
    },

    destroy: function( params, user ) {
        var group = new Group( { id: params.id } );

        return { result: group.destroy() };
    }
};

module.exports = GroupsController;
