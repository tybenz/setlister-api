var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var SetlistSongsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( req, res, next ) {
        new SetlistSongs().fetch({
            withRelated: [ 'setlist', 'song' ]
        })
        .then( function( setlistSongs ) {
            res.send( setlistSongs );
        });
    },

    show: function( req, res, next ) {
        new SetlistSong( { id: req.params.id } )
        .fetch({
            withRelated: [ 'setlist', 'song' ]
        })
        .then( function ( setlistSong ) {
            res.send( setlistSong );
        });
    },

    // The user who creates the setlist_song is added to it
    create: function( req, res, next ) {
        req.params = _.pick( req.params, [ 'key', 'capo', 'setlist_id', 'song_id' ] );

        var setlistSong = new SetlistSong( req.params );
        var setlist = new Setlist( { id: req.params.setlist_id } );

        var result = setlist.fetch({
            withRelated: [ 'group', 'group.users' ]
        })
        .then( function( setlist ) {
            if ( !setlist ) {
                res.send( 404, new Error( 'That setlist does not exist' ) );
            }

            var group = setlist.related( 'group' );
            var user = group.related( 'users' ).findWhere( { id: req.user.id } );

            // If user is null then the user does not belong
            // to the setlist_song they're trying to edit
            if ( !user && !req.user.isAdmin() ) {
                res.send( 401, new Error( 'You don\'t have access to that setlist_song.' ) );
            }

            // Pass back save() promise for router
            return setlistSong.save();
        })
        .then( function( setlistSong ) {
            res.send( setlistSong );
        });
    },

    update: function( req, res, next ) {
        var setlistSong = new SetlistSong( { id: req.params.id } );
        req.params = _.pick( req.params, [ 'key', 'capo' ] );

        var result = setlistSong.fetch({
            withRelated: [ 'setlist', 'setlist.group', 'setlist.group.users' ]
        }).then( function ( setlistSong ) {
            if ( !setlistSong ) {
                throw new Error( 'That setlist song does not exist' );
            }

            var setlist = setlistSong.related( 'setlist' );
            var group = setlist.related( 'group' );
            var user = group.related( 'users' );

            if ( !user && !req.user.isAdmin() ) {
                throw new Error( 'You don\'t have access to that setlist_song' );
            }

            return setlistSong.save( req.params );
        })
        .then( function( setlistSong ) {
            res.send( setlistSong );
        });
    },

    destroy: function( req, res, next ) {
        new SetlistSong( { id: req.params.id } )
            .destroy()
            .then( function( setlistSong ) {
                res.send( setlistSong );
            });
    }
};

module.exports = SetlistSongsController;
