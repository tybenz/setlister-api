exports.up = function(db, callback) {
    db.changeColumn( 'setlists', 'group_id', { type: 'int', notNull: true }, callback );
};

exports.down = function(db, callback) {
    db.changeColumn( 'setlists', 'group_id', { type: 'string', notNull: true }, callback );
};
