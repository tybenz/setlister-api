exports.up = function( db, callback ) {
    db.addColumn( 'artists', 'created_at', 'datetime', function() {
        db.addColumn( 'artists', 'updated_at', 'datetime', callback );
    });
};

exports.down = function( db, callback ) {
    db.removeColumn( 'artists', 'updated_at', function() {
        db.removeColumn( 'artists', 'created_at', callback );
    });
};
