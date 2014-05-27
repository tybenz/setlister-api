module.exports = function( router ) {
    router.resources( 'users' );
    router.resources( 'groups' );
    router.resources( 'setlists' );
    router.resources( 'songs' );
    router.resources( 'artists' );
    router.resources( 'setlist_songs' );
};
