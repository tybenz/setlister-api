exports.up = function(db, callback) {
    db.createTable( 'users', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        email: 'string',
        password: 'string',
        fname: 'string',
        lname: 'string',
        created_at: 'datetime',
        updated_at: 'datetime'
    }, callback );
};

exports.down = function(db, callback) {
    db.dropTable( 'users', callback );
};
