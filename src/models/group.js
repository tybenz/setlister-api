var Group = BaseModel.extend({
    users: function() {
        return this.hasMany( User ).through( GroupUser );
    },
    setlists: function() {
        return this.hasMany( Setlist );
    }
});

module.exports = Group;
