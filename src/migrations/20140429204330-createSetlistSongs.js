exports.up = function(db, callback) {
    db.createTable( 'setlist_songs', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        setlist_id: { type: 'int', notNull: true },
        song_id: { type: 'int', notNull: true },
        created_at: 'datetime',
        updated_at: 'datetime'
    }, callback );
};

exports.down = function(db, callback) {
    db.dropTable( 'setlist_songs', callback );
};
