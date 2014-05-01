var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var SetlistsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( params, user ) {
        var setlists = new Setlists();
        setlists.load( [ 'group', 'group.users' ] );
        var result = setlists.fetch( { withRelated: [ 'group' ] } ).tap( function( collection ) {
            return collection.load( [ 'group', 'group.users' ] );
        });
        return { result: result };
    },

    show: function( params, user ) {
        var setlist = new Setlist( { id: params.id } );
        var result = setlist.fetch( { withRelated: [ 'group' ] } ).tap( function( model ) {
            return model.load( [ 'group', 'group.users' ] );
        });
        return { result: result };
    },

    // The user who creates the setlist is added to it
    create: function( params, user ) {
        var setlist = new Setlist( _.pick( params, [ 'title', 'group_id' ] ) );

        var result = new Group( { id: params.group_id } ).fetch( { withRelated: [ 'users' ] } ).then( function( model ) {
            if ( !model ) {
                throw new Error( 'That group does not exist' );
            }

            return model.load( [ 'users' ] );
        }).then( function( model ) {
            var u = model.relations.users.findWhere( { id: user.id } );

            // If u is null then the user does not belong
            // to the setlist they're trying to edit
            if ( !u ) {
                throw new Error( 'You don\'t have access to that setlist.' );
            }

            // Pass back save() promise for router
            return setlist.save();
        });

        return { result: result };
    },

    update: function( params, user ) {
        var setlist = new Setlist( { id: params.id } );

        var result = setlist.fetch( { withRelated: [ 'group' ] } ).then( function( model ) {
            if ( !model ) {
                throw new Error( 'That setlist was not found.' );
            }

            return model.load( [ 'group', 'group.users' ] );
        }).then( function( model ) {
            console.log(model);
            var group = model.relations.group;

            if ( !group.relations.users ) {
                throw new Error( 'The group associated with that setlist does not exist' );
            }

            var u = group.relations.users.findWhere( { id: user.id } );

            // If u is null then the user does not belong
            // to the setlist they're trying to edit
            if ( !u ) {
                throw new Error( 'You don\'t have access to that setlist.' );
            }

            // Pass back save() promise for router
            return setlist.save( _.pick( params, [ 'title' ] ) );
        });

        return { result: result };
    },

    destroy: function( params, user ) {
        var setlist = new Setlist( { id: params.id } );

        return { result: setlist.destroy() };
    }
};

module.exports = SetlistsController;
