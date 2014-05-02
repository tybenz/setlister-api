module.exports = function( router ) {
    router.resources( 'users' );
    router.resources( 'groups' );
    router.resources( 'setlists' );
    router.resources( 'songs' );
    router.post( '/songs/:id/add_to_setlist', 'songs#addToSetlist' );
    router.resources( 'setlist_songs' );
};
