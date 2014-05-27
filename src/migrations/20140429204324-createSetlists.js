exports.up = function(db, callback) {
    db.createTable( 'setlists', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        group_id: { type: 'int', notNull: true },
        title: 'string',
        created_at: 'datetime',
        updated_at: 'datetime'
    }, callback );
};

exports.down = function(db, callback) {
    db.dropTable( 'setlists', callback );
};
