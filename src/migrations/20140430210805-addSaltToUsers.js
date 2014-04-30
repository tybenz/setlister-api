exports.up = function(db, callback) {
    db.addColumn( 'users', 'salt', { type: 'string', notNull: false }, callback );
};

exports.down = function(db, callback) {
    db.removeColumn( 'users', 'salt', callback );

};
