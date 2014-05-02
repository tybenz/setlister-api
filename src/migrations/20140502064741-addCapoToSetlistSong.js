exports.up = function(db, callback) {
    db.addColumn( 'setlist_songs', 'capo', 'int', callback );
};

exports.down = function(db, callback) {
    db.removeColumn( 'setlist_songs', 'capo', callback );
};
