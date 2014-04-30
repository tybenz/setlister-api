exports.up = function(db, callback) {
    db.createTable( 'artists', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        name: 'string'
    }, callback );
};

exports.down = function(db, callback) {
    db.dropTable( 'artists', callback );
};
