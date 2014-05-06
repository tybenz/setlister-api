var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var SongsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( params, currentUser ) {
        var songs = new Songs();
        var result = songs.fetch({
            withRelated: [ 'setlists', 'setlists.group' ]
        });
        return { result: result };
    },

    show: function( params, currentUser ) {
        var song = new Song( { id: params.id } );
        var result = song.fetch({
            withRelated: [ 'setlists', 'setlists.group' ]
        });
        return { result: result };
    },

    // The user who creates the song is added to it
    create: function( params, currentUser ) {
        params = _.pick(
            params,
            [
                'title',
                'artist_id',
                'license',
                'year',
                'text',
                'key',
                'spotify_uri',
                'capo',
                'info',
                'group_id'
            ]
        );
        var song = new Song( params );

        var result = new Group( { id: params.group_id } ).fetch({
            withRelated: [ 'users' ]
        })
        .then( function( song ) {
            if ( !song ) {
                throw new Error( 'That group does not exist' );
            }

            var user = song.related( 'users' ).findWhere( { id: currentUser.id } );

            // If u is null then the user does not belong
            // to the song they're trying to edit
            if ( !user && !currentUser.isAdmin() ) {
                throw new Error( 'You don\'t have access to that song.' );
            }

            // Pass back save() promise for router
            return song.save();
        });

        return { result: result };
    },

    update: function( params, currentUser ) {
        var song = new Song( { id: params.id } );

        var result = song.fetch({
            withRelated: [ 'group', 'group.users' ]
        })
        .then( function( song ) {
            if ( !song ) {
                throw new Error( 'That song was not found.' );
            }

            var group = song.related( 'group' );

            if ( !group.related( 'users' ) ) {
                throw new Error( 'The group associated with that song does not exist' );
            }

            var user = group.related( 'users' ).findWhere( { id: currentUser.id } );

            // If u is null then the user does not belong
            // to the song they're trying to edit
            if ( !user ) {
                throw new Error( 'You don\'t have access to that song.' );
            }

            // Pass back save() promise for router
            return song.save( _.pick( params, [ 'title' ] ) );
        });

        return { result: result };
    },

    destroy: function( params, currentUser ) {
        var song = new Song( { id: params.id } );

        return { result: song.destroy() };
    }
};

module.exports = SongsController;
