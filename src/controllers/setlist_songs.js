var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var SetlistSongsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( params, user ) {
        var setlistSongs = new SetlistSongs();
        var result = setlistSongs.fetch({
            withRelated: [ 'setlist', 'song' ]
        });
        return { result: result };
    },

    show: function( params, user ) {
        var setlistSong = new SetlistSong( { id: params.id } );
        var result = setlistSong.fetch({
            withRelated: [ 'setlist', 'song' ]
        });
        return { result: result };
    },

    // The user who creates the setlist_song is added to it
    create: function( params, user ) {
        params = _.pick( params, [ 'key', 'capo', 'setlist_id', 'song_id' ] );

        var setlistSong = new SetlistSong( params );
        var setlist = new Setlist( { id: params.setlist_id } );

        var result = setlist.fetch({
                withRelated: [ 'group', 'group.users' ]
            })
            .then( function( model ) {
                if ( !model ) {
                    throw new Error( 'That setlist does not exist' );
                }

                var group = model.related( 'group' );

                var u = group.related( 'users' ).findWhere( { id: user.id } );

                // If u is null then the user does not belong
                // to the setlist_song they're trying to edit
                if ( !u ) {
                    throw new Error( 'You don\'t have access to that setlist_song.' );
                }

                // Pass back save() promise for router
                return setlistSong.save();
            });

        return { result: result };
    },

    update: function( params, user ) {
        var setlistSong = new SetlistSong( { id: params.id } );
        params = _.pick( params, [ 'key', 'capo' ] );

        return { result: setlistSong.save( params ) };
    },

    destroy: function( params, user ) {
        var setlistSong = new SetlistSong( { id: params.id } );

        return { result: setlistSong.destroy() };
    }
};

module.exports = SetlistSongsController;
