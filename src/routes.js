module.exports = function( router ) {
    router.resources( 'users' );
    router.post( '/users/login', 'users#login' );
    router.get( '/users/logout', 'users#logout' );

    router.resources( 'groups' );
    router.resources( 'setlists' );
    router.resources( 'songs' );
    router.resources( 'artists' );
    router.resources( 'setlist_songs' );
};
