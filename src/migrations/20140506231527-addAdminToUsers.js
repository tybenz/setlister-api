exports.up = function(db, callback) {
    db.addColumn( 'users', 'admin', 'boolean', callback );
};

exports.down = function(db, callback) {
    db.removeColumn( 'users', 'admin', callback );
};
