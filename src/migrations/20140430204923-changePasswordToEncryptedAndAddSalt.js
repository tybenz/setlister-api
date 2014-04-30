exports.up = function(db, callback) {
    db.renameColumn( 'users', 'password', 'encrypted_password', callback );
};

exports.down = function(db, callback) {
    db.renameColumn( 'users', 'encrypted_password', 'password', callback );
};
