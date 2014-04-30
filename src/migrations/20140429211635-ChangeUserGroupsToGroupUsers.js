exports.up = function(db, callback) {
    db.renameTable( 'user_groups', 'group_users', callback );
};

exports.down = function(db, callback) {
    dbm.renameTable( 'group_users', 'user_groups', callback );
};
