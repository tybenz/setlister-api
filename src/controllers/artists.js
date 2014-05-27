var _ = require( 'lodash-node' );
var passport = require( 'passport' );

var ArtistsController = {
    auth: function( action ) {
        return passport.authenticate( 'basic' );
    },

    index: function( req, res, next ) {
        new Artists()
        .fetch({
            withRelated: [ 'songs' ]
        })
        .then( function( artists ) {
            res.send( artists );
        });
    },

    show: function( req, res, next ) {
        new Artist( { id: req.params.id } )
        .fetch({
            withRelated: [ 'songs' ]
        })
        .then( function ( artist ) {
            res.send( artist );
        });
    },

    create: function( req, res, next ) {
        new Artist( _.pick( req.params, [ 'name' ] ) )
        .save()
        .then( function( artist ) {
            res.send( artist );
        });
    },

    update: function( req, res, next ) {
        new Artist( { id: req.params.id } )
        .save( _.pick( req.params, [ 'name' ] ) )
        .then( function( artist ) {
            res.send( artist );
        });
    },

    destroy: function( req, res, next ) {
        new Artist( { id: req.params.id } )
        .destroy()
        .then( function( artist ) {
            res.send( artist );
        });
    }
};

module.exports = ArtistsController;
