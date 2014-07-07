var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var SongsController = {
    auth: function( action ) {
        // return passport.authenticate( 'basic' );
        return null;
    },

    index: function( req, res, next ) {
        var group_id = req.params.group_id;
        var options = {};
        if ( group_id ) {
            options.group_id = group_id;
        }

        new Songs( options ).fetch({
            withRelated: [ 'setlists', 'setlists.group' ]
        })
        .then( function( songs ) {
            res.send( songs );
        });

        next();
    },

    show: function( req, res, next ) {
        new Song( { id: req.params.id } )
        .fetch({
            withRelated: [ 'setlists', 'setlists.group' ]
        })
        .then( function( song ) {
            res.send( song );
        });
    },

    // The user who creates the song is added to it
    create: function( req, res, next ) {
        req.params = _.pick(
            req.params,
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
        var song = new Song( req.params );

        var result = new Group( { id: req.params.group_id } ).fetch({
            withRelated: [ 'users' ]
        })
        .then( function( group ) {
            if ( !group ) {
                throw new Error( 'That group does not exist' );
            }

            var user = group.related( 'users' ).findWhere( { id: req.user.id } );

            // If u is null then the user does not belong
            // to the group they're trying to edit
            if ( !user && !req.user.isAdmin() ) {
                throw new Error( 'You don\'t have access to that group\'s songs.' );
            }

            // Pass back save() promise for router
            return song.save();
        })
        .then( function( song ) {
            res.send( song );
        });
    },

    update: function( req, res, next ) {
        var song = new Song( { id: req.params.id } );
        req.params = _.pick(
            req.params,
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

            var user = group.related( 'users' ).findWhere( { id: req.user.id } );

            // If u is null then the user does not belong
            // to the song they're trying to edit
            if ( !user ) {
                throw new Error( 'You don\'t have access to that song.' );
            }

            // Pass back save() promise for router
            return song.save( req.params );
        })
        .then( function( song ) {
            res.send( song );
        });
    },

    destroy: function( req, res, next ) {
        new Song( { id: req.params.id } )
        .destroy()
        .then( function( song ) {
            res.send( song );
        });
    }
};

module.exports = SongsController;
