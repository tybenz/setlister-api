exports.up = function(db, callback) {
    db.createTable( 'groups', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        created_at: 'datetime',
        updated_at: 'datetime'
    }, callback );
};

exports.down = function(db, callback) {
    db.dropTable( 'groups', callback );
};
