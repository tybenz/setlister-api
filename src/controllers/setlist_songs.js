var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var SetlistSongsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( params, currentUser ) {
        var setlistSongs = new SetlistSongs();
        var result = setlistSongs.fetch({
            withRelated: [ 'setlist', 'song' ]
        });
        return { result: result };
    },

    show: function( params, currentUser ) {
        var setlistSong = new SetlistSong( { id: params.id } );
        var result = setlistSong.fetch({
            withRelated: [ 'setlist', 'song' ]
        });
        return { result: result };
    },

    // The user who creates the setlist_song is added to it
    create: function( params, currentUser ) {
        params = _.pick( params, [ 'key', 'capo', 'setlist_id', 'song_id' ] );

        var setlistSong = new SetlistSong( params );
        var setlist = new Setlist( { id: params.setlist_id } );

        var result = setlist.fetch({
            withRelated: [ 'group', 'group.users' ]
        })
        .then( function( setlistSong ) {
            if ( !setlistSong ) {
                throw new Error( 'That setlist does not exist' );
            }

            var group = setlistSong.related( 'group' );
            var user = group.related( 'users' ).findWhere( { id: currentUser.id } );

            // If user is null then the user does not belong
            // to the setlist_song they're trying to edit
            if ( !user && !currentUser.isAdmin() ) {
                throw new Error( 'You don\'t have access to that setlist_song.' );
            }

            // Pass back save() promise for router
            return setlistSong.save();
        });

        return { result: result };
    },

    update: function( params, currentUser ) {
        var setlistSong = new SetlistSong( { id: params.id } );
        params = _.pick( params, [ 'key', 'capo' ] );

        var result = setlistSong.fetch({
            withRelated: [ 'setlist', 'setlist.group', 'setlist.group.users' ]
        }).then( function ( setlistSong ) {
            if ( !setlistSong ) {
                throw new Error( 'That setlist song does not exist' );
            }

            var setlist = setlistSong.related( 'setlist' );
            var group = setlist.related( 'group' );
            var user = group.related( 'users' );

            if ( !user && !currentUser.isAdmin() ) {
                throw new Error( 'You don\'t have access to that setlist_song' );
            }

            return setlistSong.save( params );
        });

        return { result: result };
    },

    destroy: function( params, currentUser ) {
        var setlistSong = new SetlistSong( { id: params.id } );

        return { result: setlistSong.destroy() };
    }
};

module.exports = SetlistSongsController;
