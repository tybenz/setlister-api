exports.up = function(db, callback) {
    db.createTable( 'user_groups', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        user_id: { type: 'int', notNull: true },
        group_id: { type: 'int', notNull: true },
        created_at: 'datetime',
        updated_at: 'datetime'
    }, callback );
};

exports.down = function(db, callback) {
    db.dropTable( 'user_groups', callback );
};
