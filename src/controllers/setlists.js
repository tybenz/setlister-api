var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var SetlistsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( params, currentUser ) {
        var setlists = new Setlists();
        var result = setlists.fetch({
            withRelated: [ 'group', 'group.users', 'setlist_songs', 'setlist_songs.song' ]
        });
        return { result: result };
    },

    show: function( params, currentUser ) {
        var setlist = new Setlist( { id: params.id } );
        var result = setlist.fetch({
            withRelated: [ 'group', 'group.users', 'setlist_songs', 'setlist_songs.song' ]
        });
        return { result: result };
    },

    // The user who creates the setlist is added to it
    create: function( params, currentUser ) {
        var setlist = new Setlist( _.pick( params, [ 'title', 'group_id' ] ) );

        var result = new Group( { id: params.group_id } ).fetch({
            withRelated: [ 'users' ]
        })
        .then( function( setlist ) {
            if ( !setlist ) {
                throw new Error( 'That group does not exist' );
            }

            var user = setlist.related( 'users' ).findWhere( { id: currentUser.id } );

            // If u is null then the user does not belong
            // to the setlist they're trying to edit
            if ( !user && !currentUser.isAdmin() ) {
                throw new Error( 'You don\'t have access to that setlist.' );
            }

            // Pass back save() promise for router
            return setlist.save();
        });

        return { result: result };
    },

    update: function( params, currentUser ) {
        var setlist = new Setlist( { id: params.id } );

        var result = setlist.fetch({
            withRelated: [ 'group', 'group.users' ]
        })
        .then( function( setlist ) {
            if ( !setlist ) {
                throw new Error( 'That setlist was not found.' );
            }

            var group = setlist.related( 'group' );

            if ( !group.related( 'users' ) ) {
                throw new Error( 'The group associated with that setlist does not exist' );
            }

            var user = group.related( 'users' ).findWhere( { id: currentUser.id } );

            // If u is null then the user does not belong
            // to the setlist they're trying to edit
            if ( !user && !currentUser.isAdmin() ) {
                throw new Error( 'You don\'t have access to that setlist.' );
            }

            // Pass back save() promise for router
            return setlist.save( _.pick( params, [ 'title' ] ) );
        });

        return { result: result };
    },

    destroy: function( params, currentUser ) {
        var setlist = new Setlist( { id: params.id } );

        return { result: setlist.destroy() };
    }
};

module.exports = SetlistsController;
