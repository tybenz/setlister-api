exports.up = function(db, callback) {
    db.addColumn( 'setlist_songs', 'key', 'string', callback );
};

exports.down = function(db, callback) {
    db.removeColumn( 'setlist_songs', 'key', callback );
};
