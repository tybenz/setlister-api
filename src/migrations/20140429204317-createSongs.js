exports.up = function(db, callback) {
    db.createTable( 'songs', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        artist_id: 'int',
        license: 'string',
        year: 'datetime',
        text: 'text',
        key: 'string',
        spotify_uri: 'string',
        capo: 'integer',
        info: 'text',
        group_id: { type: 'int', notNull: true },
        created_at: 'datetime',
        updated_at: 'datetime'
    }, callback );
};

exports.down = function(db, callback) {
    db.dropTable( 'songs', callback );
};
