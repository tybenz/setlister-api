var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var SetlistsController = {
    auth: function( action ) {
        // return passport.authenticate( 'basic' );
        return null;
    },

    index: function( req, res, next ) {
        new Setlists()
        .fetch({
            withRelated: [ 'group', 'group.users', 'setlist_songs', 'setlist_songs.song' ]
        })
        .then( function( setlists ) {
            res.send( setlists );
        });
    },

    show: function( req, res, next ) {
        new Setlist( { id: req.params.id } )
        .fetch({
            withRelated: [ 'group', 'group.users', 'setlist_songs', 'setlist_songs.song' ]
        })
        .then( function( setlist ) {
            res.send( setlist );
        });
    },

    // The user who creates the setlist is added to it
    create: function( req, res, next ) {
        var setlist = new Setlist( _.pick( req.params, [ 'title', 'group_id' ] ) );

        new Group( { id: req.params.group_id } ).fetch({
            withRelated: [ 'users' ]
        })
        .then( function( group ) {
            if ( !group ) {
                throw new Error( 'That group does not exist' );
            }

            var user = group.related( 'users' ).findWhere( { id: req.user.id } );

            // If u is null then the user does not belong
            // to the setlist they're trying to edit
            if ( !user && !req.user.isAdmin() ) {
                throw new Error( 'You don\'t have access to that group\'s setlists.' );
            }

            // Pass back save() promise for router
            return setlist.save();
        })
        .then( function( setlist ) {
            res.send( setlist );
        });
    },

    update: function( req, res, next ) {
        var setlist = new Setlist( { id: req.params.id } );

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

            var user = group.related( 'users' ).findWhere( { id: req.user.id } );

            // If u is null then the user does not belong
            // to the setlist they're trying to edit
            if ( !user && !req.user.isAdmin() ) {
                throw new Error( 'You don\'t have access to that setlist.' );
            }

            // Pass back save() promise for router
            return setlist.save( _.pick( req.params, [ 'title' ] ) );
        })
        .then( function( setlist ) {
            res.send( setlist );
        });
    },

    destroy: function( req, res, next ) {
        new Setlist( { id: req.params.id } )
        .destroy()
        .then( function ( setlist ) {
            res.send( setlist );
        });
    }
};

module.exports = SetlistsController;
